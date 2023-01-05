import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { FC, ReactNode } from 'react';
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
      sx={{ minHeight: '64px', zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 'none' }}
    >
      <Toolbar>
        <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
          <MenuButton />
          <AppNameLink href="/app">FooBarScore</AppNameLink>
        </Stack>
        <Stack direction="row" alignItems="center">
          <AppBarAccount />
        </Stack>
      </Toolbar>
      <div>{children}</div>
    </AppBar>
  );
};

export default AppAppBar;
