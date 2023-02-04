import { ArrowBackIosNew as ArrowBackIosNewIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { Divider, Drawer, IconButton, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useIsSideDrawerOpen } from 'global-states/side-drawer.state';
import { FC } from 'react';
import { APP_APP_BAR_HEIGHT, APP_SIDE_DRAWER_WIDTH_DESKTOP } from 'styles/consts';
import AppDrawerItemList from '../AppSideDrawer/AppDrawerItemList';

type Props = {};

const AppSideDrawerNonDesktop: FC<Props> = () => {
  const { isSideDrawerOpen, updateSideDrawerState } = useIsSideDrawerOpen(false);

  return (
    <>
      <StyledDrawer
        variant="temporary"
        open={isSideDrawerOpen}
        onClose={() => updateSideDrawerState(false)}
      >
        <StyledToolbar>
          <IconButton
            onClick={() => updateSideDrawerState(false)}
            sx={{ width: '100%', height: '100%', justifyContent: 'end' }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </StyledToolbar>
        <Divider />
        <AppDrawerItemList Icon={DashboardIcon} />
      </StyledDrawer>
    </>
  );
};

export default AppSideDrawerNonDesktop;

const StyledDrawer = styled(Drawer)({
  zIndex: 99999,
  width: `${APP_SIDE_DRAWER_WIDTH_DESKTOP}px`,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: `${APP_SIDE_DRAWER_WIDTH_DESKTOP}px`,
    boxSizing: 'border-box',
  },
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: `${APP_APP_BAR_HEIGHT}px`,
  px: [1],
});
