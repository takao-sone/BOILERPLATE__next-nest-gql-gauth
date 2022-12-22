import { useCallback } from 'react';
import { Props } from './AppDialog';

export const useHandleConfirm = (
  onClose: Props['onClose'],
  onConfirm?: Props['dialog']['onConfirm'],
) => {
  return useCallback(() => {
    if (onConfirm) onConfirm();
    onClose();
  }, [onClose, onConfirm]);
};
