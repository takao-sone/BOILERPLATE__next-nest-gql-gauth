import { Field, ObjectType } from '@nestjs/graphql';
import { SessionUser as RedisSessionUser } from '../dtos/session-user.dto';

@ObjectType()
export class SessionUserProfile {
  @Field(() => String, {
    description: 'ユーザー名',
  })
  name!: RedisSessionUser['userProfile']['name'];
}
