import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { GraphqlConfigService } from './modules/app-config/graphql-config.service';
import { PrismaConfigService } from './modules/app-config/prisma-config.service';
import { GoogleAuthenticationModule } from './modules/google-authentication/google-authentication.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { RolesModule } from './modules/roles/roles.module';
import { TokenAuthenticationModule } from './modules/token-authentication/token-authentication.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphqlConfigService,
    }),
    UsersModule,
    RolesModule,
    TokenAuthenticationModule,
    GoogleAuthenticationModule,
    RedisModule,
    // TODO: cookieで認証する場合は以下2つをコメントイン
    // CookieAuthenticationModule,
    // SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
