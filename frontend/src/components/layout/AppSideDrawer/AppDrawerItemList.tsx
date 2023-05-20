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
import { styled } from '@mui/material/styles';
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
                <StyledListItemTextButton primary={item} />
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
            <StyledListItemTextButton>ログアウト</StyledListItemTextButton>
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
            <StyledListItemTextButton>ログイン</StyledListItemTextButton>
          </ListItemButton>
        )}
      </Box>
    </List>
  );
};

export default AppDrawerItemList;

const StyledListItemTextButton = styled((props: ListItemTextProps) => (
  <ListItemText primaryTypographyProps={{ variant: 'button' }} {...props} />
))({});
