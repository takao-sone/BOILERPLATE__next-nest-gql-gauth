import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../app-config/env.service';
import { AppAccessTokenPayload } from './custom-types';
import { SessionUser } from './dtos/session-user';

@Injectable()
export class AccessJwtTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.getAccessTokenSecret(),
    });
  }

  async validate(payload: AppAccessTokenPayload) {
    const partialUser: SessionUser = { displayedId: payload.sub, roleNames: payload.roleNames };

    return partialUser;
  }
}
