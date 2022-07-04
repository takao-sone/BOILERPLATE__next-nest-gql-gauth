import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Base } from 'src/common/models/base.model';

@ObjectType()
export class UserCredential extends Base {
  @HideField()
  userId!: number;

  @HideField()
  password!: string;

  @Field(() => String, {
    description: 'メールアドレス',
  })
  email!: string;
}
