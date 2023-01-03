import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const AppAppBar: FC<Props> = ({ children }) => {
  return (
    <AppBar sx={{ minHeight: '64px' }}>
      <Toolbar>
        <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <MenuIcon sx={{ color: 'primary.contrastText' }} />
          </IconButton>
          <Typography
            component="span"
            color="inherit"
            noWrap
            sx={{ ml: 4, fontSize: '2rem', fontWeight: 'bold' }}
          >
            FooBarScore
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" sx={{}}>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <AccountCircleOutlinedIcon sx={{ color: 'primary.contrastText' }} />
            <ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />
          </IconButton>
        </Stack>
      </Toolbar>
      <div>{children}</div>
    </AppBar>
  );
};

export default AppAppBar;
