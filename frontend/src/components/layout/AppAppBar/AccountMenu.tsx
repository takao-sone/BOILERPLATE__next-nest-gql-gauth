import { Logout as LogoutIcon, Person as PersonIcon, Sell as SellIcon } from '@mui/icons-material';
import { Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useHandleLogout } from 'components/common/GoogleIdentity/GoogleIdentity.hook';
import { useAuthUserValue } from 'global-states/auth-user.state';
import { FC } from 'react';

type Props = {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
};

const AccountMenu: FC<Props> = ({ anchorEl, handleClose }) => {
  const authUser = useAuthUserValue();
  const handleLogout = useHandleLogout();
  const mainMenuItems = [
    { label: 'プロフィール', Icon: PersonIcon },
    { label: '契約プラン', Icon: SellIcon },
  ];

  if (!authUser) return null;

  return (
    <Menu
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
      sx={{
        mt: '45px',
        '& .MuiMenuItem-root': {
          '& .MuiSvgIcon-root': {
            fontSize: 18,
            color: 'text.secondary',
            marginRight: 1.5,
          },
        },
      }}
    >
      <Box sx={{ p: '0 16px 6px' }}>
        <Typography component="p" variant="caption" sx={{ fontWeight: 'bold' }}>
          アカウント
        </Typography>
        <Typography component="p" variant="caption" color="primary.light" sx={{ pt: '6px' }}>
          {authUser?.userProfile.name}
        </Typography>
      </Box>
      <Divider sx={{ margin: '8px 0' }} />
      {mainMenuItems.map((mainMenuItem) => (
        <MenuItem key={mainMenuItem.label} onClick={handleClose}>
          <mainMenuItem.Icon />
          <Typography variant="button">{mainMenuItem.label}</Typography>
        </MenuItem>
      ))}
      <Divider />
      <MenuItem
        onClick={() => {
          handleLogout();
          handleClose();
        }}
      >
        <LogoutIcon />
        <Typography variant="button">ログアウト</Typography>
      </MenuItem>
    </Menu>
  );
};

export default AccountMenu;
