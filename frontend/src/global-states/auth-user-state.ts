import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';
import { AUTH_USER_STATE } from './atom-keys';
import { SessionUser } from 'generated/graphql';

export type AuthUser = SessionUser;

export const authUserState = atom<AuthUser | null>({
  key: AUTH_USER_STATE,
  default: null,
});

export const useAuthUser = () => {
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const updateAuthUser = useCallback(
    (newAuthUser: AuthUser | null) => {
      setAuthUser(newAuthUser);
    },
    [setAuthUser],
  );
  return { authUser, updateAuthUser };
};
