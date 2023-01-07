import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';

export const tuple = <T extends unknown[]>(...ts: T): T => {
  return ts;
};

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const theme = useTheme();
  const isGreaterThanMD = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

  useEffect(() => {
    setIsDesktop(isGreaterThanMD);
  });

  return tuple(isDesktop, setIsDesktop);
};
