import { RoleName } from '@prisma/client';

type AppBaseTokenPayload = {
  iat: number;
  exp: number;
};

// User Input Access Token Payload
export type AppUserInputAccessTokenPayload = {
  iss: string;
  aud: string[];
  sub: string;
  scope: string;
  roleNames: RoleName[];
};

// User Input Refresh Token Payload
export type AppUserInputRefreshTokenPayload = {
  iss: string;
  aud: string[];
  sub: string;
};

// Access Token Payload
export type AppAccessTokenPayload = AppBaseTokenPayload & AppUserInputAccessTokenPayload;

// Refresh Token Payload
export type AppRefreshTokenPayload = AppBaseTokenPayload & AppUserInputRefreshTokenPayload;
