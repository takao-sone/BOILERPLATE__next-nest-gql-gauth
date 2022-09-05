import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { RoleName } from '@prisma/client';
import { DEFAULT_PAGINATION_INPUT, PaginationInput } from 'src/common/pagination/pagination.input';
import { DEFAULT_ROLE_SORT_INPUT, RoleSortInput } from 'src/common/pagination/role-order.model';
import { RoleGuard } from '../token-authentication/role.guard';
import { RoleConnection } from './models/role-connection.model';
import { Role } from './models/role.model';
import { RolesService } from './roles.service';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private rolesService: RolesService) {}

  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Query(() => RoleConnection, {
    description: `
      権限: ADMIN \n
      ページネーションによりロールを取得するオペレーション \n
    `,
  })
  async getRoleConnection(
    @Args({ name: 'pagination', nullable: true, defaultValue: DEFAULT_PAGINATION_INPUT })
    paginationInput: PaginationInput,
    @Args({ name: 'sort', nullable: true, defaultValue: DEFAULT_ROLE_SORT_INPUT })
    roleSortInput: RoleSortInput,
  ) {
    return await this.rolesService.getRoleConnection(paginationInput, roleSortInput);
  }
}
