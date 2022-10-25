import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/modules/roles/models/role.model';

@ObjectType()
export class SessionUserRole {
  @Field(() => String, {
    description: 'クライアントアプリケーション側へ表示するID',
  })
  displayedId!: Role['displayedId'];

  @Field(() => String, {
    description: 'ロールの名前',
  })
  name!: Role['name'];
}
