import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloLoggingPlugin } from './apollo-logging.plugin';
import { EnvService } from './env.service';
import { customValidate } from './env.validator';
import { GraphqlConfigService } from './graphql-config.service';
import { PrismaConfigService } from './prisma-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate: customValidate,
    }),
  ],
  providers: [EnvService, GraphqlConfigService, PrismaConfigService, ApolloLoggingPlugin],
  exports: [EnvService],
})
export class AppConfigModule {}
