import Toolbar from '@mui/material/Toolbar';
import { FC, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const AppMainContent: FC<Props> = ({ children }) => {
  return (
    <>
      <Toolbar />
      {children}
    </>
  );
};

export default AppMainContent;
