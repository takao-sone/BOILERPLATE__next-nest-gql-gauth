import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button, Typography } from '@mui/material';
import { FC } from 'react';

type Props = {};

const MuiSample: FC<Props> = () => {
  return (
    <div>
      <Typography variant="h1">MUI Sample</Typography>
      <Typography variant="h2">Button</Typography>
      <Button variant="contained" color="primary">
        Boilerplate
      </Button>
      <Typography variant="h2">Text</Typography>
      <Typography variant="h3">Boilerplate</Typography>
      <h3>Boilerplate</h3>
      <Typography variant="h2">Icon</Typography>
      <AccountCircleIcon />
    </div>
  );
};

export default MuiSample;
