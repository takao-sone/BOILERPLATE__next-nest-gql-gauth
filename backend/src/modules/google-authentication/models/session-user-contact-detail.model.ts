import { Field, ObjectType } from '@nestjs/graphql';
import { SessionUser as RedisSessionUser } from '../dtos/session-user.dto';

@ObjectType()
export class SessionUserContactDetail {
  @Field(() => String, {
    description: 'メールアドレス',
  })
  email!: RedisSessionUser['userContactDetail']['email'];
}
