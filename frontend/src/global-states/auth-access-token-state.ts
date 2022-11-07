import { useCallback } from 'react';
import { atom, selector, useRecoilState } from 'recoil';
import { PersistConfiguration, recoilPersist } from 'recoil-persist';
import { AUTH_ACCESS_TOKEN_STATE } from './atom-keys';
import { getAuthenticatedUser } from 'fetchers';

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

export const authAccessTokenState = atom<AuthAccessToken | null>({
  key: AUTH_ACCESS_TOKEN_STATE,
  default: (() => {
    if (!localStorage) return null;
    const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_STATE);
    if (!accessToken) return null;
    return JSON.parse(accessToken);
  })(),
  effects: [
    persistAtom,
    ({ onSet, setSelf }) => {
      setSelf((newToken) => {
        console.log('-----------------');
        console.info('Current Token:', newToken);
        return newToken;
      });
      onSet((newToken) => {
        console.log('================');
        console.info('Current Token:', newToken);
      });
    },
  ],
});

export const vvv = selector({
  key: 'vvv',
  get: async ({ get }) => {
    const accessToken = get(authAccessTokenState);
    if (!accessToken) return;
    const resp = await getAuthenticatedUser(accessToken).catch((err) => {
      console.log(err);
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
