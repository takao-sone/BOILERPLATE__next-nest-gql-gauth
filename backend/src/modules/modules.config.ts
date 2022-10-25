import { Logger } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { EnvService } from './app-config/env.service';
import { RedisModule } from './redis/redis.module';

export const redisModule = RedisModule.registerAsync({
  imports: [AppConfigModule],
  useFactory: async (envService: EnvService) => {
    const logger = new Logger('RedisModule');

    return {
      connectionOptions: {
        host: envService.getRedisHost(),
        port: envService.getRedisPort(),
      },
      onClientReady: (client) => {
        logger.log('Redis client ready');

        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          logger.log(`Connected to redis on ${client.options.host}:${client.options.port}`);
        });
      },
    };
  },
  inject: [EnvService],
});
