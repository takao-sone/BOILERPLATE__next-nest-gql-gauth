import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Redis from 'ioredis';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { EnvService } from 'src/modules/app-config/env.service';
import { IORedisKey } from 'src/modules/redis/redis.module';
import { AppAccessTokenPayload } from '../custom-types';
import { SessionUser } from '../dtos/session-user.dto';

@Injectable()
export class AccessJwtTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private envService: EnvService, @Inject(IORedisKey) private redisClient: Redis) {
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
    // Redisからセッションユーザーを取得
    const { session: sessionKey } = payload;
    const stringSessionUser = await this.redisClient.get(sessionKey);

    if (!stringSessionUser) {
      Logger.error('validate: No session user');
      throw new UnauthorizedException();
    }

    const sessionUser = JSON.parse(stringSessionUser) as SessionUser;

    return sessionUser;
  }
}
