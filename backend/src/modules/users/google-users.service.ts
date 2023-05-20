import { Connection, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import Redis from 'ioredis';
import { PaginationInput } from 'src/common/pagination/pagination.input';
import { UserSortInput } from 'src/common/pagination/user-order.model';
import { AppCursor, appFindManyCursorConnectionOptions } from 'src/common/pagination/utils';
import { PrismaService } from '../prisma/prisma.service';
import { IORedisKey } from '../redis/redis.module';

@Injectable()
export class GoogleUsersService {
  constructor(
    private prismaService: PrismaService,
    @Inject(IORedisKey) private redisClient: Redis,
  ) {}

  /**
   * idを使用したユーザーの取得
   * @param id 対象ユーザーのid
   * @returns 取得したPrismaのUser型オブジェクト
   */
  async getUserById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  /**
   * displayedIdを使用したユーザーの取得
   * @param displayedId 対象ユーザーのdisplayedId
   * @returns 取得したPrismaのUser型オブジェクト
   */
  async getUserByDisplayedId(displayedId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { displayedId },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

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
    const { field, direction } = sortInput;

    return findManyCursorConnection<User, AppCursor>(
      (args) => {
        return this.prismaService.user.findMany({
          ...args,
          skip,
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
   * ResolveFieldで使用するUserContactDetailの取得
   * GraphQLにおけるN+1問題への対応をするためにPrismaのfluent APIを用いてデータ取得
   * @param userId 対象ユーザーのid
   * @returns 取得したPrismaのUserContactDetail型オブジェクト
   */
  async getUserContactDetailByUserId(userId: number) {
    const userContactDetail = await this.prismaService.userContactDetail.findUnique({
      where: {
        userId,
      },
    });
    if (!userContactDetail) {
      throw new NotFoundException('UserContactDetail Not Found');
    }
    return userContactDetail;
  }

  /**
   * ResolveFieldで使用するUserProfileの取得
   * GraphQLにおけるN+1問題への対応をするためにPrismaのfluent APIを用いてデータ取得
   * @param userId 対象ユーザーのid
   * @returns 取得したPrismaのUserProfile型オブジェクト
   */
  async getUserProfileByUserId(userId: number) {
    const userProfile = await this.prismaService.userProfile.findUnique({
      where: {
        userId,
      },
    });
    if (!userProfile) {
      throw new NotFoundException('UserProfile Not Found');
    }
    return userProfile;
  }

  /**
   * ResolveFieldで使用するRoleの取得
   * GraphQLにおけるN+1問題への対応をするためにPrismaのfluent APIを用いてデータ取得
   * @param userId 対象ユーザーのid
   * @returns 取得したPrismaのRole型オブジェクト
   */
  async getUserRoleByUserId(userId: number) {
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

  /**
   * ResolveFieldで使用するUserThirdPartyCredentialの取得
   * GraphQLにおけるN+1問題への対応をするためにPrismaのfluent APIを用いてデータ取得
   * @param userId 対象ユーザーのid
   * @returns 取得したPrismaのUserThirdPartyCredential型オブジェクト
   */
  async getUserThirdPartyCredentialByUserId(userId: number) {
    const userThirdPartyCredential = await this.prismaService.userThirdPartyCredential.findUnique({
      where: {
        userId,
      },
    });
    if (!userThirdPartyCredential) {
      throw new NotFoundException('UserThirdPartyCredential Not Found');
    }
    return userThirdPartyCredential;
  }
}
