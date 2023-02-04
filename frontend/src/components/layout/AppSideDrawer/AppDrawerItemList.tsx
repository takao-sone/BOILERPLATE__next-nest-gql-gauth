import { Logout as LogoutIcon } from '@mui/icons-material';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SvgIcon,
} from '@mui/material';
import { useHandleLogout } from 'components/common/GoogleIdentity/GoogleIdentity.hook';
import { useAuthUserValue } from 'global-states/auth-user.state';
import { useSetIsSideDrawerOpen } from 'global-states/side-drawer.state';
import NextLink from 'next/link';
import { FC } from 'react';
import { SX_NON_DESKTOP_DISPLAY } from 'styles/consts';

type Props = {
  Icon: typeof SvgIcon;
};

const AppDrawerItemList: FC<Props> = ({ Icon: Icon }) => {
  const authUser = useAuthUserValue();
  const handleLogout = useHandleLogout();
  const setIsNonDesktopSideDrawerOpen = useSetIsSideDrawerOpen(false);
  const menuItems = [
    { subHeader: 'メイン', items: ['ホーム', 'スコア履歴'] },
    { subHeader: 'アカウント', items: ['プロフィール', '契約プラン'] },
  ];

  return (
    <List component="nav">
      {authUser &&
        menuItems.map((menuItem) => (
          <Box key={menuItem.subHeader}>
            <ListSubheader component="div">{menuItem.subHeader}</ListSubheader>
            {menuItem.items.map((item: any) => (
              <ListItemButton
                key={item}
                onClick={() => {
                  setIsNonDesktopSideDrawerOpen(false);
                }}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1, mx: 3 }} />
          </Box>
        ))}
      <Box sx={{ ...SX_NON_DESKTOP_DISPLAY }}>
        {authUser ? (
          <ListItemButton
            onClick={() => {
              handleLogout();
              setIsNonDesktopSideDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>ログアウト</ListItemText>
          </ListItemButton>
        ) : (
          <ListItemButton
            component={NextLink}
            href="/app/login"
            onClick={() => {
              setIsNonDesktopSideDrawerOpen(false);
            }}
            sx={{ fontWeight: 'bold' }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>ログイン</ListItemText>
          </ListItemButton>
        )}
      </Box>
    </List>
  );
};

export default AppDrawerItemList;
