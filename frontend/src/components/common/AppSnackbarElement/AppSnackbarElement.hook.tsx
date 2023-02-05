import { useSnackbarPortalDOMValue } from 'global-states/snackbar-portal-dom.state';
import { useAppSnackbarValue } from 'global-states/snackbar.state';
import { createPortal } from 'react-dom';
import AppSnackbar from '../AppSnackbar/AppSnackbar';

export const useAppSnackbarElement = () => {
  const snackbarContainer = useSnackbarPortalDOMValue();
  const appSnackbar = useAppSnackbarValue();

  if (!snackbarContainer) return null;
  if (!appSnackbar) return null;

  const { severity, message, onClose } = appSnackbar;

  return createPortal(
    <AppSnackbar severity={severity} message={message} onClose={onClose} />,
    snackbarContainer,
  );
};
