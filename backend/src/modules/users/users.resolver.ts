import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RoleName } from '@prisma/client';
import { Request } from 'express';
import { CurrentReq } from 'src/common/decorators/current-req.decorator';
import { CurrentSessionUser } from 'src/common/decorators/current-session-user.decorator';
import { DEFAULT_PAGINATION_INPUT, PaginationInput } from 'src/common/pagination/pagination.input';
import { DEFAULT_USER_SORT_INPUT, UserSortInput } from 'src/common/pagination/user-order.model';
import { SessionUser } from '../token-authentication/dtos/session-user';
import { LoggedInGuard } from '../token-authentication/logged-in.guard';
import { RoleGuard } from '../token-authentication/role.guard';
import { CreateUserInput } from './dtos/create-user.input';
import { UpdateUserEmailInput } from './dtos/update-user-email.input';
import { UpdateUserRoleInput } from './dtos/update-user-role.input';
import { UserConnection } from './models/user-connection.model';
import { User } from './models/user.model';
import { TokenUsersService } from './token-users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private tokenUsersService: TokenUsersService) {}

  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Mutation(() => User, {
    description: `
      権限: ADMIN \n
      ユーザーを作成するオペレーション
    `,
  })
  async createUser(@Args('data') input: CreateUserInput) {
    const { email, password, roleDisplayedId } = input;

    return await this.tokenUsersService.createUser(email, password, roleDisplayedId);
  }

  @UseGuards(LoggedInGuard)
  @Mutation(() => User, {
    description: `
      権限: ログイン \n
      ユーザーのメールアドレスを更新するオペレーション
    `,
  })
  async updateUserEmail(
    @Args('data') input: UpdateUserEmailInput,
    @CurrentReq() req: Request,
    @CurrentSessionUser() currentSessionUser: SessionUser,
  ) {
    return await this.tokenUsersService.updateEmail(currentSessionUser.displayedId, input.newEmail);
  }

  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Mutation(() => User, {
    description: `
      権限: ADMIN \n
      ユーザーの権限を更新するオペレーション \n
      自分自身の権限は更新できない
    `,
  })
  async updateUserRole(
    @Args('data') input: UpdateUserRoleInput,
    @CurrentSessionUser() currentSessionUser: SessionUser,
  ) {
    return await this.tokenUsersService.updateRole(
      currentSessionUser.displayedId,
      input.updateTargetUserDisplayedId,
      input.newRoleDisplayedId,
    );
  }

  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Query(() => UserConnection, {
    description: `
      権限: ADMIN \n
      ページネーションによりユーザーを取得するオペレーション \n
    `,
  })
  async getUserConnection(
    @Args({ name: 'pagination', nullable: true, defaultValue: DEFAULT_PAGINATION_INPUT })
    paginationInput: PaginationInput,
    @Args({ name: 'sort', nullable: true, defaultValue: DEFAULT_USER_SORT_INPUT })
    userSortInput: UserSortInput,
  ) {
    return await this.tokenUsersService.getUserConnection(paginationInput, userSortInput);
  }

  @ResolveField('userCredential')
  async userCredential(@Parent() user: User) {
    return await this.tokenUsersService.getUserCredentialByUserId(user.id);
  }

  @ResolveField('userRole')
  async userRole(@Parent() user: User) {
    return await this.tokenUsersService.getUserRoleByUserId(user.id);
  }
}
