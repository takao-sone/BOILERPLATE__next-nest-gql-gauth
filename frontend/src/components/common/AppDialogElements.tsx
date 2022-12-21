import { useDialogElementsValue } from 'global-states/dialogs-state';
import { FC } from 'react';

const AppDialogElements: FC = () => {
  const dialogElements = useDialogElementsValue();

  return <>{dialogElements}</>;
};

export default AppDialogElements;
