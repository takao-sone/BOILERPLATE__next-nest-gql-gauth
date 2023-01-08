import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { FC, ReactNode } from 'react';
import { APP_APP_BAR_HEIGHT, SX_BASE_DISPLAY } from 'styles/consts';
import AppBarAccount from './AppBarAccount';
import AppNameLink from './AppNameLink';
import MenuButton from './MenuButton';

type Props = {
  children?: ReactNode;
};

const AppAppBar: FC<Props> = ({ children }) => {
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
          <AppNameLink href="/app">FooBarScore</AppNameLink>
        </Stack>
        <Stack direction="row" alignItems="center" sx={{ ...SX_BASE_DISPLAY }}>
          <AppBarAccount />
        </Stack>
      </Toolbar>
      <div>{children}</div>
    </AppBar>
  );
};

export default AppAppBar;
