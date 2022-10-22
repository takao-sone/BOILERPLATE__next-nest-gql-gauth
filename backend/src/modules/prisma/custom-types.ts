import { Prisma } from '@prisma/client';

// ユーザー定義の汎用型
type RequiredNonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
type Ensure<T, K extends keyof T> = T & RequiredNonNullable<Pick<T, K>>;

// Prisma.validatorによって生成する型
const userWithRolesAndNullableCredential = Prisma.validator<Prisma.UserArgs>()({
  include: { userCredential: true, userRoles: { include: { role: true } } },
});
const userWithRolesAndNullableContactDetailAndNullableProfile = Prisma.validator<Prisma.UserArgs>()(
  {
    include: {
      userContactDetail: true,
      userProfile: true,
      userRoles: { include: { role: true } },
    },
  },
);

// exportして他ファイルで使用する型
export type UserWithRolesAndNullableCredential = Prisma.UserGetPayload<
  typeof userWithRolesAndNullableCredential
>;
export type UserWithRolesAndCredential = Ensure<
  UserWithRolesAndNullableCredential,
  'userCredential'
>;
export type UserWithRolesAndNullableContactDetailAndNullableProfile = Prisma.UserGetPayload<
  typeof userWithRolesAndNullableContactDetailAndNullableProfile
>;
export type UserWithRolesAndContactDetailAndProfile = Ensure<
  UserWithRolesAndNullableContactDetailAndNullableProfile,
  'userContactDetail'
> &
  Ensure<UserWithRolesAndNullableContactDetailAndNullableProfile, 'userProfile'>;
