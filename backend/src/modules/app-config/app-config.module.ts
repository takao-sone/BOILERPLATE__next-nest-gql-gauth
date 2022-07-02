import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloLoggingPlugin } from './apollo-logging.plugin';
import { EnvService } from './env.service';
import { GraphqlConfigService } from './graphql-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  providers: [EnvService, GraphqlConfigService, ApolloLoggingPlugin],
  exports: [EnvService],
})
export class AppConfigModule {}
