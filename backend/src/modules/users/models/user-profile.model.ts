import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Base } from 'src/common/models/base.model';

@ObjectType()
export class UserProfile extends Base {
  @HideField()
  userId!: number;

  @Field(() => String, {
    description: 'ユーザー名',
  })
  name!: string;
}
