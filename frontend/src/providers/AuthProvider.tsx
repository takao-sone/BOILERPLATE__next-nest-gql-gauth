import { useAuthAccessTokenValue } from 'global-states/auth-access-token-state';
import { useAuthUserUpdate } from 'global-states/auth-user-state';
import { FC } from 'react';

type Props = {};

const AuthProvider: FC<Props> = () => {
  const authAccessToken = useAuthAccessTokenValue();
  const updateAuthUser = useAuthUserUpdate();

  if (authAccessToken) {
    updateAuthUser(authAccessToken);
  }

  return null;
};

export default AuthProvider;
