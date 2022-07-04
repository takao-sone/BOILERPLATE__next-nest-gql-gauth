import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from 'src/common/models/base.model';

@ObjectType()
export class Role extends Base {
  @Field(() => String, {
    description: 'クライアントアプリケーション側へ表示するID',
  })
  displayedId!: string;

  @Field(() => String, {
    description: 'ロールの名前',
  })
  name!: string;
}
