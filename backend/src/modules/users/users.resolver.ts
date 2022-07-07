import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RoleName } from '@prisma/client';
import { Request } from 'express';
import { CurrentReq } from 'src/common/decorators/current-req.decorator';
import { CurrentSessionUser } from 'src/common/decorators/current-session-user.decorator';
import { SessionUser } from '../authentication/dtos/session-user.dto';
import { LoggedInGuard } from '../authentication/logged-in.guard';
import { RoleGuard } from '../authentication/role.guard';
import { CreateUserInput } from './dtos/create-user.input';
import { UpdateUserEmailInput } from './dtos/update-user-email.input';
import { UpdateUserRoleInput } from './dtos/update-user-role.input';
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

  // TODO: ページネーション付与
  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Query(() => [User], {
    description: `
      権限: ADMIN \n
      すべてのユーザーを取得するオペレーション \n
    `,
  })
  async getUsers() {
    return await this.usersService.getAll();
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
