import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useCompanyName = () => {
  return process.env.NEXT_PUBLIC_APP_COMPANY_NAME!;
};

export const useAppName = () => {
  return process.env.NEXT_PUBLIC_APP_NAME!;
};

export const useIsDesktop = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
};
