import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { FC } from 'react';
import muiTheme from '../styles/mui-theme';

type Props = {};

const MuiProvider: FC<Props> = (props) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};

export default MuiProvider;
