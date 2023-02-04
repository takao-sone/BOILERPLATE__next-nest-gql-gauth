import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    // type: 'dark',
    primary: {
      light: '#4f555e',
      main: '#272c34',
      dark: '#00000d',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ffffff',
      main: '#dddddd',
      dark: '#ababab',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: [
      'Helvetica Neue',
      'Arial',
      'Hiragino Kaku Gothic ProN',
      'Hiragino Sans',
      'Meiryo',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.4rem',
    },
    h3: {
      fontSize: '2.0rem',
    },
    h4: {
      fontSize: '1.6rem',
    },
  },
});

export default muiTheme;
