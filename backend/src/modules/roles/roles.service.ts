import { Connection, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaginationInput } from 'src/common/pagination/pagination.input';
import { RoleSortInput } from 'src/common/pagination/role-order.model';
import { AppCursor, appFindManyCursorConnectionOptions } from 'src/common/pagination/utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  /**
   * ページネーション&ソートによってロールを取得
   * @param paginationInput ページネーションオブジェクト
   * @param sortInput ソートオブジェクト
   * @returns RelayStyleページネーションな取得したPrismaのRole型オブジェクト
   */
  async getRoleConnection(
    paginationInput: PaginationInput,
    sortInput: RoleSortInput,
  ): Promise<Connection<Role>> {
    const { skip, ...connectionArguments } = paginationInput;
    const { field, direction } = sortInput;

    return findManyCursorConnection<Role, AppCursor>(
      (args) => {
        return this.prismaService.role.findMany({
          ...args,
          skip,
          orderBy: {
            [field]: direction,
          },
        });
      },
      () => this.prismaService.role.count(),
      connectionArguments,
      appFindManyCursorConnectionOptions,
    );
  }
}
