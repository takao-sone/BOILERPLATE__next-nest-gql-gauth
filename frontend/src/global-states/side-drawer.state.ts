import { useCallback } from 'react';
import { AtomEffect, atomFamily, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useIsDesktop } from 'utils/helper';
import { AtomKeys } from './recoil-keys';

const windowSizeEffect: (isDesktop: boolean) => AtomEffect<boolean> =
  (isDesktop) =>
  ({ trigger, setSelf }) => {
    if (typeof window === 'undefined') return;
    if (trigger === 'get') {
      isDesktop ? setSelf(true) : setSelf(false);
    }
  };

const sideDrawerState = atomFamily<boolean, boolean>({
  key: AtomKeys.SIDE_DRAWER_STATE,
  default: true,
  effects: (isDesktop) => [windowSizeEffect(isDesktop)],
});

export const useIsSideDrawerOpen = (defaultValue?: boolean) => {
  const [isDesktop] = useIsDesktop();
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useRecoilState(
    sideDrawerState(defaultValue ?? isDesktop),
  );
  const updateSideDrawerState = useCallback(
    (newIsSideDrawerOpen: boolean) => {
      setIsSideDrawerOpen(newIsSideDrawerOpen);
    },
    [setIsSideDrawerOpen],
  );
  return { isSideDrawerOpen, updateSideDrawerState };
};

export const useIsSideDrawerOpenValue = () => {
  const [isDesktop] = useIsDesktop();
  return useRecoilValue(sideDrawerState(isDesktop));
};

export const useSetIsSideDrawerOpen = () => {
  const [isDesktop] = useIsDesktop();
  return useSetRecoilState(sideDrawerState(isDesktop));
};
