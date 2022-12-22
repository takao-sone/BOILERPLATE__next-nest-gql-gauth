import { useCallback } from 'react';
import { Props } from './AppDialog';

export const useHandleConfirm = (dialog: Props['dialog'], onClose: Props['onClose']) => {
  return useCallback(() => {
    dialog.onConfirm();
    onClose();
  }, [dialog, onClose]);
};
