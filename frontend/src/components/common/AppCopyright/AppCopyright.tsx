import { FC } from 'react';
import { useCompanyName } from 'utils/hook';
import { Typography } from '@mui/material';

type Props = {};

const AppCopyright: FC<Props> = () => {
  const companyName = useCompanyName();

  return (
    <>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        {companyName}
        {` `}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </>
  );
};

export default AppCopyright;
