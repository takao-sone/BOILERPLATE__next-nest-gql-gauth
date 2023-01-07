import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { FC } from 'react';
import { useMenuClickHandler } from './AppAppBar.hook';

type Props = {};

const MenuButton: FC<Props> = () => {
  const { handleClick } = useMenuClickHandler();

  return (
    <IconButton
      color="secondary"
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
      onClick={handleClick}
    >
      <MenuIcon sx={{ color: 'primary.contrastText' }} />
    </IconButton>
  );
};

export default MenuButton;
