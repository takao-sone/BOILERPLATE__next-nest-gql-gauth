import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import AppBaseCard from './AppBaseCard';

const AppModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <Grid container justifyContent="center" spacing={2}>
        <Grid item lg={4} md={4} sm={10} xs={10}>
          <AppBaseCard cardTitle="ログイン完了">
            <p>ログインしました。</p>
            <Button color="primary" fullWidth size="large" type="submit" variant="contained">
              OK
            </Button>
          </AppBaseCard>
        </Grid>
      </Grid>
    </Backdrop>
  );
};

export default AppModal;
