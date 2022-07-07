import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { CurrentReq } from 'src/common/decorators/current-req.decorator';
import { CurrentSessionUser } from 'src/common/decorators/current-session-user.decorator';
import { AuthenticationService } from './authentication.service';
import { LogInInput } from './dtos/log-in.input';
import { SessionUser } from './dtos/session-user.dto';
import { LocalGuard } from './local.guard';
import { LoggedInGuard } from './logged-in.guard';
import { Auth } from './models/auth.model';

@Resolver(() => Auth)
export class AuthenticationResolver {
  constructor(private authenticationService: AuthenticationService) {}

  @UseGuards(LocalGuard)
  @Mutation(() => Auth, {
    description: `
      権限: ALL \n
      ログイン用オペレーション
    `,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logIn(@Args('data') input: LogInInput) {
    const auth: Auth = {};

    return auth;
  }

  @UseGuards(LoggedInGuard)
  @Mutation(() => String, {
    description: `
      権限: ログイン \n
      ログアウト用オペレーション
    `,
  })
  async logOut(@CurrentReq() req: Request) {
    this.authenticationService.logOut(req);

    return 'Logged Out!';
  }

  @UseGuards(LoggedInGuard)
  @Query(() => Auth, {
    description: `
      権限: ログイン \n
      ログイン中のユーザー情報を取得するオペレーション
    `,
  })
  async getAuthenticatedUser() {
    const auth: Auth = {};

    return auth;
  }

  @ResolveField('authenticatedUser')
  async authenticatedUser(
    @Parent() auth: Auth,
    @CurrentSessionUser() currentSessionUser: SessionUser,
  ) {
    return await this.authenticationService.getAuthenticatedUserByUserId(currentSessionUser.id);
  }
}
