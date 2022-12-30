import { useCallback } from 'react';
import { atom, AtomEffect, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AtomKeys } from './recoil-keys';

export type AuthAccessToken = string;

const localStorageEffect: AtomEffect<AuthAccessToken | null> = ({ trigger, setSelf, onSet }) => {
  if (typeof window === 'undefined') return;

  const localStorageKey = 'accessToken';

  if (trigger === 'get') {
    const storedValue = localStorage.getItem(localStorageKey);
    if (storedValue) {
      setSelf(storedValue);
    }
  }

  onSet((newValue, _, isReset) => {
    if (isReset) {
      localStorage.removeItem(localStorageKey);
      return;
    }
    const storingValue = newValue ?? JSON.stringify(newValue);
    localStorage.setItem(localStorageKey, storingValue);
  });
};

const authAccessTokenState = atom<AuthAccessToken | null>({
  key: AtomKeys.AUTH_ACCESS_TOKEN_STATE,
  default: null,
  effects: [localStorageEffect],
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
