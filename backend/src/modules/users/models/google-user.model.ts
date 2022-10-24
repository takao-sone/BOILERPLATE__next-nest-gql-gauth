import { Field, ObjectType } from '@nestjs/graphql';
import { UserContactDetail, UserProfile, UserThirdPartyCredential } from '@prisma/client';
import { Base } from 'src/common/models/base.model';
import { Role } from 'src/modules/roles/models/role.model';
import { UserCredential } from './user-credential.model';

@ObjectType()
export class GoogleUser extends Base {
  @Field(() => String, {
    description: 'クライアントアプリケーション側へ表示するID',
  })
  displayedId!: string;

  @Field(() => UserCredential, {
    description: 'ユーザー連絡先情報',
  })
  userContactDetail?: UserContactDetail;

  @Field(() => UserCredential, {
    description: 'ユーザープロフィール情報',
  })
  userProfile?: UserProfile;

  @Field(() => Role, {
    description: 'ユーザー権限',
  })
  userRole?: Role;

  @Field(() => UserCredential, {
    description: 'ユーザー認証情報',
  })
  userThirdPartyCredential?: UserThirdPartyCredential;
}
