import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../app-config/app-config.module';
import { GoogleAuthenticationResolver } from './google-authentication.resolver';
import { GoogleAuthenticationService } from './google-authentication.service';

@Module({
  imports: [AppConfigModule, JwtModule.register({})],
  providers: [GoogleAuthenticationResolver, GoogleAuthenticationService],
})
export class GoogleAuthenticationModule {}
