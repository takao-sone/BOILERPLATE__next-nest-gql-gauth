import { SyntheticEvent, useCallback, useState } from 'react';

export const useSnackbarOpen = (initialValue: boolean) => {
  const [open, setOpen] = useState(initialValue);
  const handleClose = useCallback(
    (event: SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    },
    [setOpen],
  );
  return {
    snackbarOpen: open,
    setSnackbarOpen: setOpen,
    handleClose,
  };
};
