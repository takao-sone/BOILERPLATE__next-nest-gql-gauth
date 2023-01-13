import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { FC, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const AppMainContent: FC<Props> = ({ children }) => {
  return (
    <>
      <Container>
        <Toolbar />
        {children}
      </Container>
    </>
  );
};

export default AppMainContent;
