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
