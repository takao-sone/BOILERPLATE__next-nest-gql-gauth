import { CssBaseline, ThemeProvider } from '@mui/material';
import { FC, ReactNode } from 'react';
import muiTheme from '../styles/mui-theme';

type Props = {
  children?: ReactNode;
};

const MuiProvider: FC<Props> = (props) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};

export default MuiProvider;
