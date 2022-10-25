import { Role, User, UserContactDetail, UserProfile } from '@prisma/client';

export type SessionUser = Pick<User, 'id' | 'displayedId'> & {
  userContactDetail: Pick<UserContactDetail, 'email'>;
  userProfile: Pick<UserProfile, 'name'>;
  userRole: Pick<Role, 'displayedId' | 'name'>;
};
