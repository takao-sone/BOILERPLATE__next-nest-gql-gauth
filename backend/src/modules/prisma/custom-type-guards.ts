import {
  UserWithRolesAndContactDetailAndProfile,
  UserWithRolesAndCredential,
  UserWithRolesAndNullableContactDetailAndNullableProfile,
  UserWithRolesAndNullableCredential,
} from './custom-types';

export const isUserWithRolesAndCredential = (
  value: UserWithRolesAndNullableCredential,
): value is UserWithRolesAndCredential => {
  return value !== null && value.userCredential !== null;
};

export const isUserWithRolesAndContactDetailAndProfile = (
  value: UserWithRolesAndNullableContactDetailAndNullableProfile,
): value is UserWithRolesAndContactDetailAndProfile => {
  return value !== null && value.userContactDetail !== null && value.userProfile !== null;
};
