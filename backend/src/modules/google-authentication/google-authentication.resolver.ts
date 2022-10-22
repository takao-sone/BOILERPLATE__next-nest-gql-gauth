import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GoogleRegisterInput } from './dtos/google-register.input';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleTokenAuth } from './models/auth.model';

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
}
