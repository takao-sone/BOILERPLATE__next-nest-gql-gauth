import { useIsSideDrawerOpen } from 'global-states/side-drawer.state';
import { MouseEvent, useCallback, useState } from 'react';
import { tuple } from 'utils/helper';

export const useAccountMenuHandlers = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return tuple(anchorEl, handleClick, handleClose);
};

export const useMenuClickHandler = (isDesktop: boolean = true) => {
  const { isSideDrawerOpen, updateSideDrawerState } = useIsSideDrawerOpen(isDesktop);
  return useCallback(() => {
    updateSideDrawerState(!isSideDrawerOpen);
  }, [updateSideDrawerState, isSideDrawerOpen]);
};
