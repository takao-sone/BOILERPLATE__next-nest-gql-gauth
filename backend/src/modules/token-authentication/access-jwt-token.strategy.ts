import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { EnvService } from '../app-config/env.service';
import { AppAccessTokenPayload } from './custom-types';
import { SessionUser } from './dtos/session-user';

@Injectable()
export class AccessJwtTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private envService: EnvService) {
    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envService.getAccessTokenSecret(),
      algorithms: [envService.getJwtHashAlgorithm()],
      issuer: envService.getJwtIssuer(),
      audience: envService.getJwtAudienceWeb(),
      ignoreExpiration: false,
    };
    super(strategyOptions);
  }

  async validate(payload: AppAccessTokenPayload) {
    const partialUser: SessionUser = { displayedId: payload.sub, roleNames: payload.roleNames };

    return partialUser;
  }
}
