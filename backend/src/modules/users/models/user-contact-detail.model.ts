import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Base } from 'src/common/models/base.model';

@ObjectType()
export class UserContactDetail extends Base {
  @HideField()
  userId!: number;

  @Field(() => String, {
    description: 'メールアドレス',
  })
  email!: string;
}
