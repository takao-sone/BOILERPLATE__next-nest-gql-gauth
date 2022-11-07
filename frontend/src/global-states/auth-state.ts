import { useCallback } from 'react';
import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';
import { PersistConfiguration, recoilPersist } from 'recoil-persist';
import { AUTH_ACCESS_TOKEN_STATE, AUTH_USER_STATE } from './atom-keys';
import { getAuthenticatedUser } from 'fetchers';
import { SessionUser } from 'generated/graphql';

const localStorage = typeof window !== 'undefined' ? window.localStorage : undefined;
let persistConfiguration: PersistConfiguration = {
  key: AUTH_ACCESS_TOKEN_STATE,
};
if (localStorage) {
  persistConfiguration = {
    ...persistConfiguration,
    storage: localStorage,
  };
}
const { persistAtom } = recoilPersist(persistConfiguration);

export type AuthAccessToken = string;
export type AuthUser = SessionUser;

export const authAccessTokenState = atom<AuthAccessToken | null>({
  key: AUTH_ACCESS_TOKEN_STATE,
  default: (() => {
    if (!localStorage) return null;
    const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_STATE);
    if (!accessToken) return null;
    return JSON.parse(accessToken);
  })(),
  effects: [persistAtom],
});

export const authUserState = selector<AuthUser | undefined>({
  key: AUTH_USER_STATE,
  get: async ({ get }) => {
    const accessToken = get(authAccessTokenState);
    if (!accessToken) return;
    const resp = await getAuthenticatedUser(accessToken).catch((err) => {
      if (err instanceof Error) throw new Error(err.message);
      throw err;
    });
    if (!resp) return;
    return resp.authenticatedUser;
  },
});

export const useAuthAccessToken = () => {
  const [authAccessToken, setAuthAccessToken] = useRecoilState(authAccessTokenState);
  const updateAuthAccessToken = useCallback(
    (newAuthAccessToken: AuthAccessToken | null) => {
      setAuthAccessToken(newAuthAccessToken);
    },
    [setAuthAccessToken],
  );
  return { authAccessToken, updateAuthAccessToken };
};

export const useSetAuthAccessToken = () => {
  return useSetRecoilState(authAccessTokenState);
};
