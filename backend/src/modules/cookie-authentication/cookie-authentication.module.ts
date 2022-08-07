import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { CookieAuthenticationResolver } from './cookie-authentication.resolver';
import { CookieAuthenticationService } from './cookie-authentication.service';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [SessionModule],
  providers: [
    CookieAuthenticationService,
    CookieAuthenticationResolver,
    LocalStrategy,
    LocalSerializer,
  ],
})
export class CookieAuthenticationModule {}
