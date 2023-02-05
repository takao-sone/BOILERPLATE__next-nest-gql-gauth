import { Close } from '@mui/icons-material';
import { Alert, AlertColor, IconButton, Snackbar } from '@mui/material';
import { useAppSnackbarUpdate } from 'global-states/snackbar.state';
import { FC, SyntheticEvent } from 'react';
import { useSnackbarOpen } from './AppSnackbar.hook';

type Props = {
  severity: AlertColor;
  message: string;
  onClose: (() => void) | undefined;
};

const AppSnackbar: FC<Props> = ({ message, severity, onClose }) => {
  const { snackbarOpen, handleClose } = useSnackbarOpen(true);
  const updateSnackbar = useAppSnackbarUpdate();
  const customOnClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose && onClose();
    updateSnackbar(null);
    handleClose(event);
  };

  return (
    <Snackbar
      open={snackbarOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={6000}
      message={message}
      onClose={customOnClose}
      action={
        <IconButton aria-label="close" onClick={customOnClose}>
          <Close />
        </IconButton>
      }
    >
      <Alert
        variant="filled"
        severity={severity}
        onClose={customOnClose}
        sx={{ fontWeight: 'bold' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar;
