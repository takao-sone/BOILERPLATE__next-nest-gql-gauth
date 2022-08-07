import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CookieAuthenticationService } from './cookie-authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: CookieAuthenticationService) {
    super({ usernameField: 'email' });
  }

  // MEMO: validateメソッドの返り値が変更になる場合、LocalSerializerの各メソッドも要変更
  async validate(email: string, password: string) {
    return await this.authenticationService.validateUser(email, password);
  }
}
