import { Module } from '@nestjs/common';
import { GoogleUsersResolver } from './google-users.resolver';
import { GoogleUsersService } from './google-users.service';

@Module({
  // MEMO: cookie認証
  // imports: [SessionModule],
  providers: [
    GoogleUsersResolver,
    GoogleUsersService,
    // TokenUsersService,
    // MEMO: cookie認証
    // CookieUsersService,
  ],
})
export class UsersModule {}
