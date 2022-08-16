import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../app-config/env.service';
import { AppAccessTokenPayload } from './custom-types';

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
    const partialUser: Pick<User, 'displayedId'> = { displayedId: payload.sub };

    return partialUser;
  }
}
