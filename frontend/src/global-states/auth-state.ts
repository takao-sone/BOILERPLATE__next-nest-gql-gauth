import { ClientError } from 'graphql-request';
import { useCallback } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { PersistConfiguration, recoilPersist } from 'recoil-persist';
import { AtomKeys, SelectorKeys } from './recoil-keys';
import { getAuthenticatedUser } from 'fetchers';
import { SessionUser } from 'generated/graphql';

const localStorage = typeof window !== 'undefined' ? window.localStorage : undefined;
let persistConfiguration: PersistConfiguration = {
  key: AtomKeys.AUTH_ACCESS_TOKEN_STATE,
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

const authAccessTokenState = atom<AuthAccessToken | null>({
  key: AtomKeys.AUTH_ACCESS_TOKEN_STATE,
  default: (() => {
    if (!localStorage) return null;
    const accessToken = localStorage.getItem(AtomKeys.AUTH_ACCESS_TOKEN_STATE);
    if (!accessToken) return null;
    return JSON.parse(accessToken);
  })(),
  effects: [persistAtom],
});

const authUserState = selector<AuthUser | null>({
  key: SelectorKeys.AUTH_USER_STATE,
  get: async ({ get }) => {
    const accessToken = get(authAccessTokenState);
    if (!accessToken) return null;
    const resp = await getAuthenticatedUser(accessToken).catch((err) => {
      if (err instanceof ClientError) {
        const errors = err.response.errors;
        const errorMessage = errors ? errors[0]?.message : 'unauthorized';
        console.error(errorMessage);
      }
      return null;
    });
    if (!resp) return null;
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

export const useAuthAccessTokenValue = () => {
  return useRecoilValue(authAccessTokenState);
};

export const useSetAuthAccessToken = () => {
  return useSetRecoilState(authAccessTokenState);
};

export const useAuthUserValue = () => {
  return useRecoilValue(authUserState);
};
