import { Role, User, UserCredential } from '@prisma/client';

export type SessionUser = Pick<User, 'id' | 'displayedId'> & {
  userCredential: Pick<UserCredential, 'email'>;
  userRole: Pick<Role, 'displayedId' | 'name'>;
};
