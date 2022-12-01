import { getAuthenticatedUser } from 'fetchers';
import { SessionUser } from 'generated/graphql';
import { ClientError } from 'graphql-request';
import { useCallback } from 'react';
import { atom, SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';
import { AtomKeys } from './recoil-keys';

export type AuthUser = SessionUser;

const useUpdateAuthUserCallback = (setAuthUser: SetterOrUpdater<SessionUser | null>) =>
  useCallback(
    async (newAccessToken: string) => {
      const resp = await getAuthenticatedUser(newAccessToken).catch((err) => {
        if (err instanceof ClientError) {
          const errors = err.response.errors;
          const errorMessage = errors ? errors[0]?.message : 'unauthorized';
          console.error(errorMessage);
        }
        return;
      });
      if (!resp) return;
      setAuthUser(resp.authenticatedUser);
    },
    [setAuthUser],
  );

const authUserState = atom<AuthUser | null>({
  key: AtomKeys.AUTH_USER_STATE,
  default: null,
});

export const useAuthUser = () => {
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const updateAuthUser = useUpdateAuthUserCallback(setAuthUser);
  return { authUser, setAuthUser, updateAuthUser };
};

export const useAuthUserUpdate = () => {
  const setAuthUser = useSetRecoilState(authUserState);
  const updateAuthUser = useUpdateAuthUserCallback(setAuthUser);
  return updateAuthUser;
};
