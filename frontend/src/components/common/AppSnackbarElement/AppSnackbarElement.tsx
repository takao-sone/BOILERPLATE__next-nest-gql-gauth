import { FC } from 'react';
import { useAppSnackbarElement } from './AppSnackbarElement.hook';

type Props = {};

const AppSnackbarElement: FC<Props> = () => {
  const snackbrElement = useAppSnackbarElement();

  return <>{snackbrElement}</>;
};

export default AppSnackbarElement;
