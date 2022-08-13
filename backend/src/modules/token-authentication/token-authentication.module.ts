import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../app-config/app-config.module';
import { LocalStrategy } from './local.strategy';
import { TokenAuthenticationResolver } from './token-authentication.resolver';
import { TokenAuthenticationService } from './token-authentication.service';

@Module({
  imports: [AppConfigModule, JwtModule.register({})],
  providers: [TokenAuthenticationService, LocalStrategy, TokenAuthenticationResolver],
})
export class TokenAuthenticationModule {}
