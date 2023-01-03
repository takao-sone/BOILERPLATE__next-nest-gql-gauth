import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import { FC } from 'react';
import AccountMenu from './AccountMenu';
import { useAccountMenuHandlers } from './AppAppBar.hook';

type Props = {};

const AppBarAccount: FC<Props> = () => {
  const [anchorEl, handleClick, handleClose] = useAccountMenuHandlers();
  const mainMenuItems = ['プロフィール', '契約プラン'];

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="secondary"
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <AccountCircleOutlinedIcon sx={{ color: 'primary.contrastText' }} />
        <ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />
      </IconButton>
      <AccountMenu anchorEl={anchorEl} handleClose={handleClose} mainMenuItems={mainMenuItems} />
    </>
  );
};

export default AppBarAccount;
