import { RoleName, User } from '@prisma/client';

export type SessionUser = Pick<User, 'displayedId'> & {
  roleNames: RoleName[];
};
