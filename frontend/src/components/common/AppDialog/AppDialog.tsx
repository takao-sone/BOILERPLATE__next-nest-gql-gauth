import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DialogInContext } from 'global-states/dialogs.state';
import { FC } from 'react';
import RecoilStateDebugButton from '../../dev/RecoilStateDebugBtn';
import { useHandleConfirm } from './AppDialog.hooks';

export type Props = {
  dialog: DialogInContext;
  onClose: () => void;
};

const AppDialog: FC<Props> = ({ dialog, onClose }) => {
  const handleConfirm = useHandleConfirm(onClose, dialog.onConfirm);

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">{dialog.contentText}</DialogContentText>
        <RecoilStateDebugButton />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{dialog.closeText}</Button>
        {dialog.confirmText && (
          <Button onClick={handleConfirm} autoFocus>
            {dialog.confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AppDialog;
