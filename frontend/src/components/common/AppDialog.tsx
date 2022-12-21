import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogInContext } from 'global-states/dialogs-state';
import { FC, useState } from 'react';

type Props = {
  dialog: DialogInContext;
  onClose: () => void;
};

const AppDialog: FC<Props> = ({ dialog, onClose }) => {
  const [open, _] = useState(true);
  const handleConfirm = () => {
    dialog.onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">{dialog.contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{dialog.closeText}</Button>
        <Button onClick={handleConfirm} autoFocus>
          {dialog.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppDialog;
