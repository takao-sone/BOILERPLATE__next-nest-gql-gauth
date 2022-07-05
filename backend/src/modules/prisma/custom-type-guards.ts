import { UserWithRolesAndCredential, UserWithRolesAndNullableCredential } from './custom-types';

export const isUserWithRolesAndCredential = (
  value: UserWithRolesAndNullableCredential,
): value is UserWithRolesAndCredential => {
  return value !== null && value.userCredential !== null;
};
