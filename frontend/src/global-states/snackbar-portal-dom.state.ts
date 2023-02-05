import { atom, AtomEffect, useRecoilValue } from 'recoil';
import { AtomKeys } from './recoil-keys';

type SnackbarPortalDOM = HTMLElement;

export const SnackbarPortalDOMId = 'snackbar-portal';

const InitiationAtomEffect: AtomEffect<SnackbarPortalDOM | null> = ({ setSelf }) => {
  if (typeof window === 'undefined') return;
  const initialValue = window.document.getElementById(SnackbarPortalDOMId);
  setSelf(initialValue);
};

export const snackbarPortalDOMState = atom<SnackbarPortalDOM | null>({
  key: AtomKeys.SNACKBAR_PORTAL_DOM_STATE,
  default: null,
  effects: [InitiationAtomEffect],
});

export const useSnackbarPortalDOMValue = () => {
  return useRecoilValue(snackbarPortalDOMState);
};
