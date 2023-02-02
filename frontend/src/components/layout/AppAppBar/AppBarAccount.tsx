import { FC } from 'react';
import AccountButton from './AccountButton';
import AccountMenu from './AccountMenu';
import { useAccountMenuHandlers } from './AppAppBar.hook';

type Props = {};

const AppBarAccount: FC<Props> = () => {
  const [anchorEl, handleClick, handleClose] = useAccountMenuHandlers();

  return (
    <>
      <AccountButton handleClick={handleClick} />
      <AccountMenu anchorEl={anchorEl} handleClose={handleClose} />
    </>
  );
};

export default AppBarAccount;
