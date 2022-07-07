import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from 'src/common/models/base.model';
import { Role } from 'src/modules/roles/models/role.model';
import { UserCredential } from './user-credential.model';

@ObjectType()
export class User extends Base {
  @Field(() => String, {
    description: 'クライアントアプリケーション側へ表示するID',
  })
  displayedId!: string;

  @Field(() => UserCredential, {
    description: 'ユーザー認証情報',
  })
  userCredential?: UserCredential;

  @Field(() => Role, {
    description: 'ユーザー権限',
  })
  userRole?: Role;
}
