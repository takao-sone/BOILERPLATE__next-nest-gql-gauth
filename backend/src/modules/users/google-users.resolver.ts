import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RoleName } from '@prisma/client';
import { DEFAULT_PAGINATION_INPUT, PaginationInput } from 'src/common/pagination/pagination.input';
import { DEFAULT_USER_SORT_INPUT, UserSortInput } from 'src/common/pagination/user-order.model';
import { RoleGuard } from '../google-authentication/guards/role.guard';
import { UserArgs } from './dtos/google-user.args';
import { GoogleUsersService } from './google-users.service';
import { GoogleUserConnection } from './models/google-user-connection.model';
import { GoogleUser } from './models/google-user.model';

@Resolver(() => GoogleUser)
export class GoogleUsersResolver {
  constructor(private googleUsersService: GoogleUsersService) {}

  // TODO: 権限見直す
  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Query(() => GoogleUser, {
    description: `
      権限: ADMIN \n
      ユーザーのdisplayedIdによってユーザーを取得するオペレーション \n
    `,
  })
  async user(@Args() userArgs: UserArgs) {
    return await this.googleUsersService.getUserByDisplayedId(userArgs.displayedId);
  }

  // TODO: 本番で消す
  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Query(() => GoogleUserConnection, {
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

  @ResolveField('userContactDetail')
  async userContactDetail(@Parent() user: GoogleUser) {
    return await this.googleUsersService.getUserContactDetailByUserId(user.id);
  }

  @ResolveField('userProfile')
  async userProfile(@Parent() user: GoogleUser) {
    return await this.googleUsersService.getUserProfileByUserId(user.id);
  }

  @ResolveField('userRole')
  async userRole(@Parent() user: GoogleUser) {
    return await this.googleUsersService.getUserRoleByUserId(user.id);
  }

  @ResolveField('userThirdPartyCredential')
  async userThirdPartyCredential(@Parent() user: GoogleUser) {
    return await this.googleUsersService.getUserThirdPartyCredentialByUserId(user.id);
  }
}
