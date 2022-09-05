import { Module } from '@nestjs/common';
import { TokenUsersService } from './token-users.service';
import { UsersResolver } from './users.resolver';

@Module({
  // MEMO: cookie認証
  // imports: [SessionModule],
  providers: [
    UsersResolver,
    TokenUsersService,
    // MEMO: cookie認証
    // CookieUsersService,
  ],
})
export class UsersModule {}
