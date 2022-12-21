import { atom, AtomEffect, useRecoilValue } from 'recoil';
import { AtomKeys } from './recoil-keys';

type DialogPortalDOM = HTMLElement;

export const DialogPortalDOMId = 'dialog-portal';

const InitiationAtomEffect: AtomEffect<DialogPortalDOM | null> = ({ setSelf }) => {
  if (typeof window === 'undefined') return;
  const initialValue = window.document.getElementById(DialogPortalDOMId);
  setSelf(initialValue);
};

export const dialogPortalDOMState = atom<DialogPortalDOM | null>({
  key: AtomKeys.DIALOG_PORTAL_DOM_STATE,
  default: null,
  effects: [InitiationAtomEffect],
});

export const useDialogPortalDOM = () => {
  return useRecoilValue(dialogPortalDOMState);
};
