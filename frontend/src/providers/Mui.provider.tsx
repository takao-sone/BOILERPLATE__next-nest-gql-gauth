import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
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
