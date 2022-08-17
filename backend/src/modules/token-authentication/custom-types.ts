import { RoleName } from '@prisma/client';

type AppBaseTokenPayload = {
  iat: number;
  exp: number;
};

// User Input Access Token Payload
export type AppUserInputAccessTokenPayload = {
  sub: string;
  scope: string;
  roleNames: RoleName[];
};

// User Input Refresh Token Payload
export type AppUserInputRefreshTokenPayload = {
  sub: string;
};

// Access Token Payload
export type AppAccessTokenPayload = AppBaseTokenPayload & AppUserInputAccessTokenPayload;

// Refresh Token Payload
export type AppRefreshTokenPayload = AppBaseTokenPayload & AppUserInputRefreshTokenPayload;
