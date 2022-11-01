import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';
import { PersistConfiguration, recoilPersist } from 'recoil-persist';
import { AUTH_ACCESS_TOKEN_STATE } from './atom-keys';

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

const authAccessTokenState = atom<AuthAccessToken | null>({
  key: AUTH_ACCESS_TOKEN_STATE,
  default: (() => {
    if (!localStorage) return null;
    const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_STATE);
    if (!accessToken) return null;
    return JSON.parse(accessToken);
  })(),
  effects_UNSTABLE: [persistAtom],
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
