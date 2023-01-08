import { useCallback } from 'react';
import { AtomEffect, atomFamily, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AtomKeys } from './recoil-keys';

const windowSizeEffect: (isDesktop: boolean) => AtomEffect<boolean> =
  (isDesktop) =>
  ({ trigger, setSelf }) => {
    if (typeof window === 'undefined') return;
    if (trigger === 'get') {
      isDesktop || setSelf(false);
    }
  };

const sideDrawerState = atomFamily<boolean, boolean>({
  key: AtomKeys.SIDE_DRAWER_STATE,
  default: true,
  effects: (isDesktop) => [windowSizeEffect(isDesktop)],
});

export const useIsSideDrawerOpen = (isDesktop: boolean = true) => {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useRecoilState(sideDrawerState(isDesktop));
  const updateSideDrawerState = useCallback(
    (newIsSideDrawerOpen: boolean) => {
      setIsSideDrawerOpen(newIsSideDrawerOpen);
    },
    [setIsSideDrawerOpen],
  );
  return { isSideDrawerOpen, updateSideDrawerState };
};

export const useIsSideDrawerOpenValue = (isDesktop: boolean = true) => {
  return useRecoilValue(sideDrawerState(isDesktop));
};

export const useSetIsSideDrawerOpen = (isDesktop: boolean = true) => {
  return useSetRecoilState(sideDrawerState(isDesktop));
};
