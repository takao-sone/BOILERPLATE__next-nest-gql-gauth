import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import { AppFooter } from 'components/common/AppFooter';
import { FC, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const AppMainContent: FC<Props> = ({ children }) => {
  return (
    <>
      <Toolbar />
      <Container>
        {children}
        <Divider sx={{ mt: 6 }} />
        <AppFooter />
      </Container>
    </>
  );
};

export default AppMainContent;
