import AppDialog from 'components/common/AppDialog';
import { createPortal } from 'react-dom';
import { atom, selector, useRecoilCallback, useRecoilValue } from 'recoil';
import { dialogPortalDOMState } from './dialog-portal-dom-state';
import { AtomKeys, SelectorKeys } from './recoil-keys';

type Dialog = {
  title: string;
  contentText: string;
  closeText: string;
  confirmText: string;
  onConfirm: () => void;
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

const dialogElementsState = selector({
  key: SelectorKeys.DIALOG_ELEMENTS_STATE,
  get: ({ get, getCallback }) => {
    const dialogContainer = get(dialogPortalDOMState);
    const { dialogs } = get(dialogsState);
    if (!dialogContainer) return [];
    return dialogs.map((targetDialog) => {
      const onClose = getCallback(({ set }) => () => {
        set(dialogsState, ({ dialogs, ...rest }) => {
          return {
            dialogs: dialogs.filter((d) => targetDialog.id !== d.id),
            ...rest,
          };
        });
      });
      return createPortal(<AppDialog dialog={targetDialog} onClose={onClose} />, dialogContainer);
    });
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

export const useDialogElementsValue = () => {
  return useRecoilValue(dialogElementsState);
};
