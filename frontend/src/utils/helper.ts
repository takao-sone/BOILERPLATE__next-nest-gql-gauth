import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const tuple = <T extends unknown[]>(...ts: T): T => {
  return ts;
};

export const useIsLessThanBreakpoint = (breakpoint: Breakpoint) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
};
