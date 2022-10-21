import { DynamicModule, FactoryProvider, Logger, Module, ModuleMetadata } from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';

export const IORedisKey = 'IORedis';

type RedisModuleOptions = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis) => void;
};

type RedisAsyncModuleOptions = {
  useFactory: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Required<Pick<ModuleMetadata, 'imports'>> &
  Required<Pick<FactoryProvider, 'inject'>>;

@Module({})
export class RedisModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: IORedisKey,
      useFactory: async (...args: any[]) => {
        const { connectionOptions, onClientReady } = await useFactory(...args);

        if (!onClientReady) {
          Logger.error('RedisModule.registerAsync: onClientReady is undefined');
          throw new Error();
        }

        const client = new IORedis(connectionOptions);
        onClientReady(client);

        return client;
      },
      inject,
    };

    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
