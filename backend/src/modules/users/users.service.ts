import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, User, UserCredential } from '@prisma/client';
import { hash } from 'bcrypt';
import { Request } from 'express';
import { isUserWithRolesAndCredential } from '../prisma/custom-type-guards';
import { UserWithRolesAndNullableCredential } from '../prisma/custom-types';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class UsersService {
  private ENCRYPTION_SALT_ROUNDS = 10;

  constructor(private prismaService: PrismaService, private sessionService: SessionService) {}

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
   * @param req リクエストオブジェクト (セッションデータ更新用)
   * @param userId 対象ユーザーのid
   * @param newEmail 新しく更新する予定のメールアドレス
   * @returns 更新後のPrismaのUser型オブジェクト
   */
  async updateEmail(req: Request, userId: number, newEmail: string): Promise<User> {
    const existingUserCredential = await this.prismaService.user
      .findUnique({ where: { id: userId } })
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
        where: { id: userId },
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

    // セッション情報の更新
    this.sessionService.updateUserSession(req, updatedUser);

    const { userCredential, userRoles, ...user } = updatedUser;

    return user;
  }

  /**
   * ユーザーのロールを更新する。
   * この操作をしたユーザー（セッションユーザー、ログインしているユーザー）が自身のロールを更新することは不可。
   * @param currentSessionUserId 現在ログインしているユーザーのid
   * @param updateTargetUserDisplayedId 更新対象ユーザーの表示用id
   * @param newRoleDisplayedId 新しく紐付けるロールの表示用id
   * @returns 更新後のPrismaのUser型オブジェクト
   */
  async updateRole(
    currentSessionUserId: number,
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
    if (currentSessionUserId === updateTargetUser.id) {
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
   * TODO: ページネーション付与
   * 登録されたユーザーをすべて取得する
   * @returns 取得したPrismaのUser[]
   */
  async getAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  // TODO
  async getAllConnection() {
    return findManyCursorConnection(
      (args) => {
        console.log('---');
        console.log(args);

        return this.prismaService.user.findMany();
      },
      () => this.prismaService.user.count(),
      { first: 1 },
      {
        getCursor: (record) => ({
          id: record.displayedId,
        }),
      },
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
