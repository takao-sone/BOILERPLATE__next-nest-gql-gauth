import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [SessionModule],
  providers: [AuthenticationService, AuthenticationResolver, LocalStrategy, LocalSerializer],
})
export class AuthenticationModule {}
