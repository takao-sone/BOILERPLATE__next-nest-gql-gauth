import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoleName } from '@prisma/client';
import { CurrentAccessToken } from 'src/common/decorators/current-access-token.decorator';
import { CurrentSessionUser } from 'src/common/decorators/current-session-user.decorator';
import { GoogleLoginInput } from './dtos/google-login.input';
import { GoogleRegisterInput } from './dtos/google-register.input';
import { SessionUser as RedisSessionUser } from './dtos/session-user.dto';
import { GoogleAuthenticationService } from './google-authentication.service';
import { LoggedInGuard } from './guards/logged-in.guard';
import { RoleGuard } from './guards/role.guard';
import { GoogleTokenAuth } from './models/auth.model';
import { SessionUser as SessionUserModel } from './models/session-user.model';

@Resolver(() => GoogleTokenAuth)
export class GoogleAuthenticationResolver {
  constructor(private googleAuthenticationService: GoogleAuthenticationService) {}

  @Mutation(() => GoogleTokenAuth, {
    description: `
      権限: ALL \n
      Google Identityを使用した新規ユーザー登録用オペレーション
    `,
  })
  async googleRegisterUser(@Args('data') input: GoogleRegisterInput) {
    const { credential } = input;
    const googleTokenAuth = await this.googleAuthenticationService.registerGoogleUser(credential);
    return googleTokenAuth;
  }

  @UseGuards(LoggedInGuard)
  @Query(() => SessionUserModel, {
    description: `
      権限: Logged-In \n
      現在ログインしているユーザーの情報 \n
    `,
  })
  async authenticatedUser(@CurrentSessionUser() currentSessionUser: RedisSessionUser) {
    return currentSessionUser;
  }

  @Mutation(() => GoogleTokenAuth, {
    description: `
      権限: ALL \n
      Google Identityを使用したログインオペレーション
    `,
  })
  async googleLogin(@Args('data') input: GoogleLoginInput) {
    return await this.googleAuthenticationService.login(input.credential);
  }

  @UseGuards(LoggedInGuard)
  @Mutation(() => String, {
    description: `
      権限: Logged-In \n
      Google Identityを使用したログアウトオペレーション
    `,
  })
  async googleLogout(
    @CurrentAccessToken() accessToken: string,
    @CurrentSessionUser() currentSessionUser: RedisSessionUser,
  ) {
    await this.googleAuthenticationService.logout(accessToken, currentSessionUser);
    return 'Logged out';
  }

  // TODO: 本番で消す
  @UseGuards(LoggedInGuard)
  @Query(() => String, {
    description: `
      権限: ALL \n
      テスト
    `,
  })
  async testLoggedInGuard(@CurrentSessionUser() currentSessionUser: RedisSessionUser) {
    console.log('testLoggedInGuard=========================');
    console.log(currentSessionUser);
    return 'OK';
  }

  // TODO: 本番で消す
  @UseGuards(RoleGuard(RoleName.ADMIN))
  @Query(() => String, {
    description: `
      権限: ALL \n
      テスト
    `,
  })
  async testRoleGuard(@CurrentSessionUser() currentSessionUser: RedisSessionUser) {
    console.log('testRoleGuard=========================');
    console.log(currentSessionUser);
    return 'OK';
  }
}
