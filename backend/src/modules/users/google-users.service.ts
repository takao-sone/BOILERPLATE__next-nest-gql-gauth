import { Connection, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import Redis from 'ioredis';
import { PaginationInput } from 'src/common/pagination/pagination.input';
import { UserSortInput } from 'src/common/pagination/user-order.model';
import {
  AppCursor,
  appFindManyCursorConnectionOptions,
  createFindManyArgs,
} from 'src/common/pagination/utils';
import { PrismaService } from '../prisma/prisma.service';
import { IORedisKey } from '../redis/redis.module';
import { Role } from '../roles/models/role.model';

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
