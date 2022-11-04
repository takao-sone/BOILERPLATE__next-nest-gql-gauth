import { FC } from 'react';
import { useAuthenticatedUser } from 'fetchers';

type Props = {};

const AuthState: FC<Props> = () => {
  useAuthenticatedUser();

  return null;
};

export default AuthState;
