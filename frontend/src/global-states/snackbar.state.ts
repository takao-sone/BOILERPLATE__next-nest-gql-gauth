import { AlertColor } from '@mui/material';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AtomKeys } from './recoil-keys';

export type AppSnackbar = {
  severity: AlertColor;
  message: string;
  onClose?: () => void;
};

const snackbarState = atom<AppSnackbar | null>({
  key: AtomKeys.SNACKBAR_STATE,
  default: null,
});

export const useAppSnackbar = () => {
  return useRecoilState(snackbarState);
};

export const useAppSnackbarValue = () => {
  return useRecoilValue(snackbarState);
};

export const useAppSnackbarUpdate = () => {
  return useSetRecoilState(snackbarState);
};
