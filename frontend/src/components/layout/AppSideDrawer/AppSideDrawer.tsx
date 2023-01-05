import DashboardIcon from '@mui/icons-material/Dashboard';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { FC } from 'react';

type Props = {};

const AppSideDrawer: FC<Props> = () => {
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: '200px',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: '200px', boxSizing: 'border-box' },
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
