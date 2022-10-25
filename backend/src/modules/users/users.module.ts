import { Module } from '@nestjs/common';
import { redisModule } from '../modules.config';
import { GoogleUsersResolver } from './google-users.resolver';
import { GoogleUsersService } from './google-users.service';

@Module({
  // MEMO: cookie認証
  // imports: [SessionModule],
  imports: [redisModule],
  providers: [
    GoogleUsersResolver,
    GoogleUsersService,
    // TokenUsersService,
    // MEMO: cookie認証
    // CookieUsersService,
  ],
})
export class UsersModule {}
