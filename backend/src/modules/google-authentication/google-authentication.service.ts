import { Inject, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import Redis from 'ioredis';
import { EnvService } from '../app-config/env.service';
import { IORedisKey } from '../redis/redis.module';

@Injectable()
export class GoogleAuthenticationService {
  constructor(private envService: EnvService, @Inject(IORedisKey) private redisClient: Redis) {}

  async googleRegisterUser(credential: string) {
    const clientId = '215238456245-lsbrf798nakg9ujh98rh50hk25p48ce4.apps.googleusercontent.com';

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('googleRegisterUser: No Token Payload');
    }

    // TODO
    console.log(payload);

    await this.redisClient.set('sone', 'takao');
  }
}
