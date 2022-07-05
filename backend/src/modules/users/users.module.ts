import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [SessionModule],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
