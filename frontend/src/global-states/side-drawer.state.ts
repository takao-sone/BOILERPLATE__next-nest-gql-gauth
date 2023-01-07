import { useCallback } from 'react';
import { AtomEffect, atomFamily, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useIsLessThanBreakpoint } from 'utils/helper';
import { AtomKeys } from './recoil-keys';

const windowSizeEffect: (isMobile: boolean) => AtomEffect<boolean> =
  (isMobile) =>
  ({ trigger, setSelf }) => {
    if (typeof window === 'undefined') return;
    if (trigger === 'get') {
      isMobile ? setSelf(false) : setSelf(true);
    }
  };

const sideDrawerState = atomFamily<boolean, boolean>({
  key: AtomKeys.SIDE_DRAWER_STATE,
  default: true,
  effects: (isMobile) => [windowSizeEffect(isMobile)],
});

export const useIsSideDrawerOpen = () => {
  const isMobile = useIsLessThanBreakpoint('sm');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useRecoilState(sideDrawerState(isMobile));
  const updateSideDrawerState = useCallback(
    (newIsSideDrawerOpen: boolean) => {
      setIsSideDrawerOpen(newIsSideDrawerOpen);
    },
    [setIsSideDrawerOpen],
  );
  return { isSideDrawerOpen, updateSideDrawerState };
};

export const useIsSideDrawerOpenValue = () => {
  const isMobile = useIsLessThanBreakpoint('sm');
  return useRecoilValue(sideDrawerState(isMobile));
};

export const useSetIsSideDrawerOpen = () => {
  const isMobile = useIsLessThanBreakpoint('sm');
  return useSetRecoilState(sideDrawerState(isMobile));
};
