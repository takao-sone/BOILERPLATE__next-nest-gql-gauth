import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { FC } from 'react';

type Props = {};

const MenuButton: FC<Props> = () => {
  return (
    <IconButton
      color="secondary"
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      <MenuIcon sx={{ color: 'primary.contrastText' }} />
    </IconButton>
  );
};

export default MenuButton;
