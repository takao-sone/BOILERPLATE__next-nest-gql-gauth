import DashboardIcon from '@mui/icons-material/Dashboard';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useIsSideDrawerOpenValue } from 'global-states/side-drawer.state';
import { FC } from 'react';
import { APP_SIDE_DRAWER_WIDTH_DESKTOP } from './AppSideDrawer.const';

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
        <List component="nav">
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="ホーム" primaryTypographyProps={{ fontWeight: 'bold' }} />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="スコア履歴" primaryTypographyProps={{ fontWeight: 'bold' }} />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};

export default AppSideDrawer;
