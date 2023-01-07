import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useIsSideDrawerOpenValue } from 'global-states/side-drawer.state';
import { FC, ReactNode } from 'react';
import { APP_SIDE_DRAWER_WIDTH_DESKTOP, SX_BASE_DISPLAY } from 'styles/consts';
import { AppAppBar } from '../AppAppBar';
import { AppMainContent } from '../AppMainContent';
import { AppSideDrawer } from '../AppSideDrawer';
import { AppSideDrawerNonDesktop } from '../AppSideDrawerNonDesktop';

const StyledBox = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${APP_SIDE_DRAWER_WIDTH_DESKTOP}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}));

type Props = {
  children?: ReactNode;
};

const AppLayout: FC<Props> = ({ children }) => {
  const isSideDrawerOpen = useIsSideDrawerOpenValue();

  return (
    <>
      <Stack>
        <AppAppBar />
        <Stack direction="row">
          <Box sx={{ ...SX_BASE_DISPLAY }}>
            <AppSideDrawer />
          </Box>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <AppSideDrawerNonDesktop />
          </Box>
          <StyledBox component="main" open={isSideDrawerOpen}>
            <AppMainContent>{children}</AppMainContent>
          </StyledBox>
        </Stack>
      </Stack>
    </>
  );
};

export default AppLayout;
