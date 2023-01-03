import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

type Props = {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  mainMenuItems: string[];
};

const AccountMenu: FC<Props> = ({ anchorEl, handleClose, mainMenuItems }) => {
  return (
    <Menu
      sx={{ mt: '45px' }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <Box sx={{ p: '0 16px 6px' }}>
        <Typography component="p" variant="caption" sx={{ fontWeight: 'bold' }}>
          アカウント
        </Typography>
        <Typography component="p" variant="caption" color="primary.light" sx={{ pt: '6px' }}>
          アカウント名
        </Typography>
      </Box>
      <Divider sx={{ margin: '8px 0' }} />
      {mainMenuItems.map((mainMenuItem) => (
        <MenuItem key={mainMenuItem} onClick={handleClose}>
          {mainMenuItem}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem onClick={handleClose}>ログアウト</MenuItem>
    </Menu>
  );
};

export default AccountMenu;
