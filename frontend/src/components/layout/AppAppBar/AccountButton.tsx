import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import { FC, MouseEvent } from 'react';

type Props = {
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

const AccountButton: FC<Props> = ({ handleClick }) => {
  return (
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
  );
};

export default AccountButton;
