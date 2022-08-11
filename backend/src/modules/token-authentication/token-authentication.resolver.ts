import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserWithRolesAndCredential } from '../prisma/custom-types';
import { CurrentAuthenticatedUser } from './decorators/current-authenticated-user.decorator';
import { TokenLogInInput } from './dtos/log-in.input';
import { TokenLogOutInput } from './dtos/log-out.input';
import { LocalGuard } from './local.guard';
import { TokenAuth } from './models/auth.model';
import { TokenAuthenticationService } from './token-authentication.service';

// TODO
// authGuardの対応したらオペレーションネームを変更する
@Resolver(() => TokenAuth)
export class TokenAuthenticationResolver {
  constructor(private tokenAuthenticationService: TokenAuthenticationService) {}

  @UseGuards(LocalGuard)
  @Mutation(() => TokenAuth, {
    description: `
      権限: ALL \n
      ログイン用オペレーション
    `,
  })
  async tokenLogIn(
    @Args('data') input: TokenLogInInput,
    @CurrentAuthenticatedUser() authenticatedUser: UserWithRolesAndCredential,
  ) {
    const auth = this.tokenAuthenticationService.logIn(authenticatedUser);

    return auth;
  }

  @Mutation(() => String, {
    nullable: true,
    description: `
      権限: ALL \n
      ログアウト用オペレーション
    `,
  })
  async tokenLogOut(@Args('data') input: TokenLogOutInput) {
    const { refreshToken } = input;
    await this.tokenAuthenticationService.logOut(refreshToken);

    return 'Logged out';
  }
}