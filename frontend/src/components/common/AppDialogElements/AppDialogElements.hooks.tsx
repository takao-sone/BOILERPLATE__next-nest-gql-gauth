import { useDialogPortalDOMValue } from 'global-states/dialog-portal-dom.state';
import { useDialogs } from 'global-states/dialogs.state';
import { createPortal } from 'react-dom';
import { AppDialog } from '../AppDialog';

export const useDialogElements = () => {
  const dialogContainer = useDialogPortalDOMValue();
  const [{ dialogs: currentDialogs, ...rest }, setDialogs] = useDialogs();

  if (!dialogContainer) return [];

  return currentDialogs.map((targetDialog) => {
    const onClose = () => {
      setDialogs({
        dialogs: currentDialogs.filter((d) => targetDialog.id !== d.id),
        ...rest,
      });
    };
    return createPortal(<AppDialog dialog={targetDialog} onClose={onClose} />, dialogContainer);
  });
};
