import { useAuthAccessTokenValue } from 'global-states/auth-access-token.state';
import { useUpdateAuthUser } from 'global-states/auth-user.state';
import { FC } from 'react';

type Props = {};

const AuthProvider: FC<Props> = () => {
  const authAccessToken = useAuthAccessTokenValue();
  const updateAuthUser = useUpdateAuthUser();

  if (authAccessToken) {
    updateAuthUser(authAccessToken);
  }

  return null;
};

export default AuthProvider;
