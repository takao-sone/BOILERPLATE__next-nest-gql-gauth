import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useIsSideDrawerOpen } from 'global-states/side-drawer.state';
import { FC } from 'react';
import { APP_APP_BAR_HEIGHT, APP_SIDE_DRAWER_WIDTH_DESKTOP } from 'styles/consts';
import AppDrawerItemList from '../AppSideDrawer/AppDrawerItemList';

type Props = {};

const AppSideDrawerNonDesktop: FC<Props> = () => {
  const { isSideDrawerOpen, updateSideDrawerState } = useIsSideDrawerOpen(false);
  const menuItems = [
    { subHeader: 'メイン', items: ['ホーム', 'スコア履歴'] },
    { subHeader: 'アカウント', items: ['プロフィール', '契約プラン'] },
  ];

  return (
    <>
      <Drawer
        variant="temporary"
        open={isSideDrawerOpen}
        onClose={() => updateSideDrawerState(false)}
        sx={{
          zIndex: 99999,
          width: `${APP_SIDE_DRAWER_WIDTH_DESKTOP}px`,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: `${APP_SIDE_DRAWER_WIDTH_DESKTOP}px`,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: `${APP_APP_BAR_HEIGHT}px`,
            px: [1],
          }}
        >
          <IconButton onClick={() => updateSideDrawerState(false)}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <AppDrawerItemList Icon={DashboardIcon} menuItems={menuItems} />
      </Drawer>
    </>
  );
};

export default AppSideDrawerNonDesktop;
