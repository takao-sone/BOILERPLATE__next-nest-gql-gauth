import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../app-config/app-config.module';
import { redisModule } from '../modules.config';
import { GoogleAuthenticationResolver } from './google-authentication.resolver';
import { GoogleAuthenticationService } from './google-authentication.service';
import { AccessJwtTokenStrategy } from './strategies/access-jwt-token.strategy';

@Module({
  imports: [AppConfigModule, redisModule, JwtModule.register({})],
  providers: [GoogleAuthenticationResolver, GoogleAuthenticationService, AccessJwtTokenStrategy],
})
export class GoogleAuthenticationModule {}
