import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { GraphqlConfigService } from './modules/app-config/graphql-config.service';
import { PrismaConfigService } from './modules/app-config/prisma-config.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RolesModule } from './modules/roles/roles.module';
import { SampleModule } from './modules/sample/sample.module';
import { SessionModule } from './modules/session/session.module';
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
    // TODO: サンプルです、本番運用の際に削除してください。
    SampleModule,
    UsersModule,
    AuthenticationModule,
    RolesModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
