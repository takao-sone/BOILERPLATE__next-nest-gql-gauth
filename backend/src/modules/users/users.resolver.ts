import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RoleName } from '@prisma/client';
import { Request } from 'express';
import { CurrentReq } from 'src/common/decorators/current-req.decorator';
import { DEFAULT_PAGINATION_INPUT, PaginationInput } from 'src/common/pagination/pagination.input';
import { DEFAULT_USER_SORT_INPUT, UserSortInput } from 'src/common/pagination/user-order.model';
import { CurrentSessionUser } from '../cookie-authentication/decorators/current-session-user.decorator';
import { SessionUser } from '../cookie-authentication/dtos/session-user.dto';
import { LoggedInGuard } from '../cookie-authentication/logged-in.guard';
import { RoleGuard } from '../cookie-authentication/role.guard';
import { CreateUserInput } from './dtos/create-user.input';
import { UpdateUserEmailInput } from './dtos/update-user-email.input';
import { UpdateUserRoleInput } from './dtos/update-user-role.input';
import { UserConnection } from './models/user-connection.model';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Mutation(() => User, {
    description: `
      権限: ADMIN \n
      ユーザーを作成するオペレーション
    `,
  })
  async createUser(@Args('data') input: CreateUserInput) {
    const { email, password, roleDisplayedId } = input;

    return await this.usersService.createUser(email, password, roleDisplayedId);
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
    return await this.usersService.updateEmail(req, currentSessionUser.id, input.newEmail);
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
    return await this.usersService.updateRole(
      currentSessionUser.id,
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
    return await this.usersService.getUserConnection(paginationInput, userSortInput);
  }

  @ResolveField('userCredential')
  async userCredential(@Parent() user: User) {
    return await this.usersService.getUserCredentialByUserId(user.id);
  }

  @ResolveField('userRole')
  async userRole(@Parent() user: User) {
    return await this.usersService.getUserRoleByUserId(user.id);
  }
}
