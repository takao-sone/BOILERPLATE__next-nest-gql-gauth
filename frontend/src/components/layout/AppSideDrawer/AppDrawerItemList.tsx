import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SvgIcon from '@mui/material/SvgIcon';
import { FC } from 'react';

type Props = {
  Icon: typeof SvgIcon;
  menuItems: any[];
};

const AppDrawerItemList: FC<Props> = ({ Icon: Icon, menuItems }) => {
  return (
    <List component="nav">
      {menuItems.map((menuItem) => (
        <div key={menuItem.subHeader}>
          <ListSubheader component="div">{menuItem.subHeader}</ListSubheader>
          {menuItem.items.map((item: any) => (
            <ListItemButton key={item}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1, mx: 3 }} />
        </div>
      ))}
    </List>
  );
};

export default AppDrawerItemList;
