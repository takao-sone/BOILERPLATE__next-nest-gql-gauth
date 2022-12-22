import { FC } from 'react';
import { useDialogElements } from './AppDialogElements.hook';

type Props = {};

const AppDialogElements: FC<Props> = () => {
  const dialogElements = useDialogElements();

  return <>{dialogElements}</>;
};

export default AppDialogElements;
