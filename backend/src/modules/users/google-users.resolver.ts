import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { RoleName } from '@prisma/client';
import { DEFAULT_PAGINATION_INPUT, PaginationInput } from 'src/common/pagination/pagination.input';
import { DEFAULT_USER_SORT_INPUT, UserSortInput } from 'src/common/pagination/user-order.model';
import { RoleGuard } from '../token-authentication/role.guard';
import { GoogleUsersService } from './google-users.service';
import { GoogleUser } from './models/google-user.model';
import { UserConnection } from './models/user-connection.model';

@Resolver(() => GoogleUser)
export class GoogleUsersResolver {
  constructor(private googleUsersService: GoogleUsersService) {}

  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Query(() => UserConnection, {
    description: `
      権限: ADMIN \n
      ページネーションによりユーザーを取得するオペレーション \n
    `,
  })
  async userConnection(
    @Args({ name: 'pagination', nullable: true, defaultValue: DEFAULT_PAGINATION_INPUT })
    paginationInput: PaginationInput,
    @Args({ name: 'sort', nullable: true, defaultValue: DEFAULT_USER_SORT_INPUT })
    userSortInput: UserSortInput,
  ) {
    return await this.googleUsersService.getUserConnection(paginationInput, userSortInput);
  }

  // @ResolveField('userCredential')
  // async userCredential(@Parent() user: User) {
  //   return await this.googleUsersService.getUserCredentialByUserId(user.id);
  // }

  // @ResolveField('userRole')
  // async userRole(@Parent() user: User) {
  //   return await this.googleUsersService.getUserRoleByUserId(user.id);
  // }
}
