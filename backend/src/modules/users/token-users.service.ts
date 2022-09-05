import { Connection, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { PaginationInput } from 'src/common/pagination/pagination.input';
import { UserSortInput } from 'src/common/pagination/user-order.model';
import {
  AppCursor,
  appFindManyCursorConnectionOptions,
  createFindManyArgs,
} from 'src/common/pagination/utils';
import { isUserWithRolesAndCredential } from '../prisma/custom-type-guards';
import { UserWithRolesAndNullableCredential } from '../prisma/custom-types';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../roles/models/role.model';
import { UserCredential } from './models/user-credential.model';

@Injectable()
export class TokenUsersService {
  private ENCRYPTION_SALT_ROUNDS = 10;

  constructor(private prismaService: PrismaService) {}

  /**
   * 新規ユーザーの作成
   * @param email ユーザーのメールアドレス
   * @param password ユーザーの平文パスワード
   * @param roleDisplayedId ユーザーへ割り当てるロールの表示用ID
   * @returns 作成したPrismaのUser型オブジェクト
   */
  async createUser(email: string, password: string, roleDisplayedId: string): Promise<User> {
    const hashedPassword = await hash(password, this.ENCRYPTION_SALT_ROUNDS);

    try {
      return await this.prismaService.user.create({
        data: {
          userCredential: {
            create: {
              email,
              password: hashedPassword,
            },
          },
          userRoles: {
            create: {
              role: {
                connect: {
                  displayedId: roleDisplayedId,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            throw new ConflictException(`Email ${email} already used.`);
          default:
            Logger.error(`Prisma Error Code: ${err.code}, ${err.message}`);
            throw new InternalServerErrorException();
        }
      }

      if (err instanceof Error) {
        Logger.error(err.message);
        throw new InternalServerErrorException();
      }

      throw err;
    }
  }

  /**
   * idを使用したユーザーの取得
   * @param id 対象ユーザーのid
   * @returns 取得したPrismaのUser型オブジェクト
   */
  async getUserById(id: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  /**
   * ユーザーのメールアドレスを更新した後、セッションのユーザーデータを更新
   * @param userDisplayedId 対象ユーザーのdisplayedId
   * @param newEmail 新しく更新する予定のメールアドレス
   * @returns 更新後のPrismaのUser型オブジェクト
   */
  async updateEmail(userDisplayedId: string, newEmail: string): Promise<User> {
    const existingUserCredential = await this.prismaService.user
      .findUnique({ where: { displayedId: userDisplayedId } })
      .userCredential();

    if (!existingUserCredential) {
      throw new NotFoundException('User Not Found');
    }

    // 変更前と変更予定のメールアドレスが同一の場合
    if (newEmail === existingUserCredential.email) {
      throw new ConflictException(`The Email ${newEmail} is the same as the existing one.`);
    }

    let updatedUser: UserWithRolesAndNullableCredential;

    // ユーザー情報の更新
    try {
      updatedUser = await this.prismaService.user.update({
        where: { displayedId: userDisplayedId },
        data: {
          userCredential: {
            update: { email: newEmail },
          },
        },
        include: { userCredential: true, userRoles: { include: { role: true } } },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            throw new ConflictException(`Email ${newEmail} already used.`);
          case 'P2016':
            throw new NotFoundException(`User NOT found.`);
          default:
            Logger.error(`Prisma Error Code: ${err.code}, ${err.message}`);
            throw new InternalServerErrorException(`Email update Failed.`);
        }
      }

      if (err instanceof Error) {
        Logger.error(`updateEmail: ${err.message}`);
        throw new InternalServerErrorException();
      }

      throw err;
    }

    if (!isUserWithRolesAndCredential(updatedUser)) {
      Logger.error(`updateEmail: updatedUser is not type of UserWithCredential.`);
      throw new InternalServerErrorException();
    }

    const { userCredential, userRoles, ...user } = updatedUser;

    return user;
  }

  /**
   * ユーザーのロールを更新する。
   * この操作をしたユーザー（セッションユーザー、ログインしているユーザー）が自身のロールを更新することは不可。
   * @param currentSessionUserDisplayedId 現在ログインしているユーザーのdisplayedId
   * @param updateTargetUserDisplayedId 更新対象ユーザーの表示用id
   * @param newRoleDisplayedId 新しく紐付けるロールの表示用id
   * @returns 更新後のPrismaのUser型オブジェクト
   */
  async updateRole(
    currentSessionUserDisplayedId: string,
    updateTargetUserDisplayedId: string,
    newRoleDisplayedId: string,
  ): Promise<User> {
    const updateTargetUser = await this.prismaService.user.findUnique({
      where: { displayedId: updateTargetUserDisplayedId },
    });

    if (!updateTargetUser) {
      throw new NotFoundException('User Not Found');
    }

    // 自分で自分のロールは更新不可
    if (currentSessionUserDisplayedId === updateTargetUser.displayedId) {
      throw new ForbiddenException('A user does not update its own role.');
    }

    const existingRoleBelongingToUpdatingUser = await this.prismaService.usersRoles
      .findUnique({
        where: {
          userId: updateTargetUser.id,
        },
      })
      .role();

    if (!existingRoleBelongingToUpdatingUser) {
      throw new NotFoundException('User Not Found');
    }

    let updatedUser: UserWithRolesAndNullableCredential;

    // ユーザー情報の更新
    try {
      updatedUser = await this.prismaService.user.update({
        where: { id: updateTargetUser.id },
        data: {
          userRoles: {
            update: {
              where: {
                userId: updateTargetUser.id,
              },
              data: {
                role: {
                  connect: {
                    displayedId: newRoleDisplayedId,
                  },
                },
              },
            },
          },
        },
        include: { userCredential: true, userRoles: { include: { role: true } } },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2016':
            throw new NotFoundException(`User NOT found.`);
          default:
            Logger.error(`Prisma Error Code: ${err.code}, ${err.message}`);
            throw new InternalServerErrorException(`Email update Failed.`);
        }
      }

      if (err instanceof Error) {
        Logger.error(`updateRole: ${err.message}`);
        throw new InternalServerErrorException();
      }

      throw err;
    }

    if (!isUserWithRolesAndCredential(updatedUser)) {
      Logger.error(`updateEmail: updatedUser is not type of UserWithCredential.`);
      throw new InternalServerErrorException();
    }

    const { userCredential, userRoles, ...user } = updatedUser;

    return user;
  }

  /**
   * ページネーション&ソートによってユーザーを取得
   * @param paginationInput ページネーションオブジェクト
   * @param sortInput ソートオブジェクト
   * @returns RelayStyleページネーションな取得したPrismaのUser型オブジェクト
   */
  async getUserConnection(
    paginationInput: PaginationInput,
    sortInput: UserSortInput,
  ): Promise<Connection<User>> {
    const { skip, ...connectionArguments } = paginationInput;

    return findManyCursorConnection<User, AppCursor>(
      () => {
        const findManyArgs = createFindManyArgs(paginationInput);
        const { field, direction } = sortInput;

        return this.prismaService.user.findMany({
          ...findManyArgs,
          orderBy: {
            [field]: direction,
          },
        });
      },
      () => this.prismaService.user.count(),
      connectionArguments,
      appFindManyCursorConnectionOptions,
    );
  }

  /**
   * ResolveFieldで使用するUserCredentialの取得
   * GraphQLにおけるN+1問題への対応をするためにPrismaのfluent APIを用いてデータ取得
   * @param userId 対象秘匿情報のユーザーのid
   * @returns 取得したPrismaのUserCredential型オブジェクト
   */
  async getUserCredentialByUserId(userId: number): Promise<UserCredential> {
    const userCredential = await this.prismaService.user
      .findUnique({ where: { id: userId } })
      .userCredential();

    if (!userCredential) {
      throw new NotFoundException('User Not Found');
    }

    return userCredential;
  }

  /**
   * ResolveFieldで使用するRoleの取得
   * GraphQLにおけるN+1問題への対応をするためにPrismaのfluent APIを用いてデータ取得
   * @param userId 対象ユーザーのid
   * @returns 取得したPrismaのRole型オブジェクト
   */
  async getUserRoleByUserId(userId: number): Promise<Role> {
    const role = await this.prismaService.usersRoles
      .findUnique({
        where: {
          userId,
        },
      })
      .role();

    if (!role) {
      throw new NotFoundException('Role Not Found');
    }

    return role;
  }
}
