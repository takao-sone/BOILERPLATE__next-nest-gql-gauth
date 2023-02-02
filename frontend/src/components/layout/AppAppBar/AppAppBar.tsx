import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useAuthUserValue } from 'global-states/auth-user.state';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import { APP_APP_BAR_HEIGHT, SX_BASE_DISPLAY } from 'styles/consts';
import { useAppName } from 'utils/hook';
import AppBarAccount from './AppBarAccount';
import AppNameLink from './AppNameLink';
import MenuButton from './MenuButton';

type Props = {
  children?: ReactNode;
};

const AppAppBar: FC<Props> = ({ children }) => {
  const authUser = useAuthUserValue();
  const appName = useAppName();

  return (
    <AppBar
      position="fixed"
      sx={{
        minHeight: `${APP_APP_BAR_HEIGHT}px`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ height: `${APP_APP_BAR_HEIGHT}px` }}>
        <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
          <MenuButton />
          <AppNameLink href="/app">{appName}</AppNameLink>
        </Stack>
        <Stack direction="row" alignItems="center" sx={{ ...SX_BASE_DISPLAY }}>
          {authUser ? (
            <AppBarAccount />
          ) : (
            <Button
              component={NextLink}
              variant="outlined"
              color="secondary"
              sx={{ fontWeight: 'bold' }}
              href="/app/login"
            >
              ログイン
            </Button>
          )}
        </Stack>
      </Toolbar>
      <div>{children}</div>
    </AppBar>
  );
};

export default AppAppBar;
