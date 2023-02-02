import DashboardIcon from '@mui/icons-material/Dashboard';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { useIsSideDrawerOpenValue } from 'global-states/side-drawer.state';
import { FC } from 'react';
import { APP_SIDE_DRAWER_WIDTH_DESKTOP } from 'styles/consts';
import AppDrawerItemList from './AppDrawerItemList';

type Props = {};

const AppSideDrawer: FC<Props> = () => {
  const isSideDrawerOpen = useIsSideDrawerOpenValue();

  return (
    <>
      <Drawer
        variant="persistent"
        open={isSideDrawerOpen}
        sx={{
          width: `${APP_SIDE_DRAWER_WIDTH_DESKTOP}px`,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: `${APP_SIDE_DRAWER_WIDTH_DESKTOP}px`,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <AppDrawerItemList Icon={DashboardIcon} />
      </Drawer>
    </>
  );
};

export default AppSideDrawer;
