import { Menu as MenuIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
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
