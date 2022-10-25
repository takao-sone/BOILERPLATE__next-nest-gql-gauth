import { Field, ObjectType } from '@nestjs/graphql';
import { SessionUser as RedisSessionUser } from '../dtos/session-user.dto';
import { SessionUserContactDetail } from './session-user-contact-detail.model';
import { SessionUserProfile } from './session-user-profile.model';
import { SessionUserRole } from './session-user-role.model';

@ObjectType()
export class SessionUser {
  @Field(() => String, {
    description: 'アクセストークン',
  })
  displayedId!: RedisSessionUser['displayedId'];

  @Field(() => SessionUserContactDetail, {
    description: 'ユーザー連絡先情報',
  })
  userContactDetail!: SessionUserContactDetail;

  @Field(() => SessionUserProfile, {
    description: 'ユーザープロフィール',
  })
  userProfile!: SessionUserProfile;

  @Field(() => SessionUserRole, {
    description: 'ユーザー権限',
  })
  userRole!: SessionUserRole;
}
