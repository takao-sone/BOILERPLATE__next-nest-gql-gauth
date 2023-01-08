import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { FC } from 'react';
import { useIsDesktop } from 'utils/hook';
import { useMenuClickHandler } from './AppAppBar.hook';

type Props = {};

const MenuButton: FC<Props> = () => {
  const isDesktop = useIsDesktop();
  const handleClick = useMenuClickHandler(isDesktop);

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
