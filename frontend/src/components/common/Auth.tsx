import { FC } from 'react';
import { useAuthenticatedUser } from 'fetchers';

type Props = {};

const Auth: FC<Props> = () => {
  useAuthenticatedUser();

  return null;
};

export default Auth;
