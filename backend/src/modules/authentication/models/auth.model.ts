import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/models/user.model';

@ObjectType()
export class Auth {
  @Field(() => User, {
    description: 'ログインしているユーザーの情報',
  })
  authenticatedUser?: User;
}
