import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from 'src/common/models/base.model';
import { Role } from 'src/modules/roles/models/role.model';
import { UserContactDetail } from './user-contact-detail.model';
import { UserProfile } from './user-profile.model';
import { UserThirdPartyCredential } from './user-third-party-credential.model';

@ObjectType()
export class GoogleUser extends Base {
  @Field(() => String, {
    description: 'クライアントアプリケーション側へ表示するID',
  })
  displayedId!: string;

  @Field(() => UserContactDetail, {
    description: 'ユーザー連絡先情報',
  })
  userContactDetail?: UserContactDetail;

  @Field(() => UserProfile, {
    description: 'ユーザープロフィール情報',
  })
  userProfile?: UserProfile;

  @Field(() => Role, {
    description: 'ユーザー権限',
  })
  userRole?: Role;

  @Field(() => UserThirdPartyCredential, {
    description: 'ユーザー認証情報',
  })
  userThirdPartyCredential?: UserThirdPartyCredential;
}
