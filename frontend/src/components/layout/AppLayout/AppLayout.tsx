import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { FC, ReactNode } from 'react';
import { AppAppBar } from '../AppAppBar';
import { AppMainContent } from '../AppMainContent';
import { AppSideDrawer } from '../AppSideDrawer';

type Props = {
  children?: ReactNode;
};

const AppLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Stack>
        <AppAppBar />
        <Stack direction="row">
          <AppSideDrawer />
          <Box component="main" flexGrow={1} p={3}>
            <AppMainContent>{children}</AppMainContent>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default AppLayout;
