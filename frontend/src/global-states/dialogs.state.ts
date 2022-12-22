import { atom, useRecoilCallback, useRecoilState } from 'recoil';
import { AtomKeys } from './recoil-keys';

export type Dialog = {
  title: string;
  contentText: string;
  closeText: string;
  confirmText?: string;
  onConfirm?: () => void;
};

export type DialogInContext = Dialog & {
  id: number;
};

type Dialogs = {
  dialogs: DialogInContext[];
  nextDialogId: number;
};

const dialogsState = atom<Dialogs>({
  key: AtomKeys.DIALOGS_STATE,
  default: {
    dialogs: [],
    nextDialogId: 1,
  },
});

export const useDialog = () => {
  const showDialog = useRecoilCallback(({ set }) => (dialog: Dialog) => {
    set(dialogsState, ({ dialogs, nextDialogId }) => {
      return {
        dialogs: [
          ...dialogs,
          {
            ...dialog,
            id: nextDialogId,
          },
        ],
        nextDialogId: nextDialogId + 1,
      };
    });
  });
  return {
    showDialog,
  };
};

export const useDialogs = () => {
  return useRecoilState(dialogsState);
};
