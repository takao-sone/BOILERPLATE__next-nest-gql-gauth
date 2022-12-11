'use client';

import { useAuthAccessTokenValue } from 'global-states/auth-access-token-state';
import { useAuthUserUpdate } from 'global-states/auth-user-state';
import { FC, useEffect } from 'react';

type Props = {};

const AuthProvider: FC<Props> = () => {
  const authAccessToken = useAuthAccessTokenValue();
  const updateAuthUser = useAuthUserUpdate();
  // const authUsr = useAuthUsr();
  console.log('---AuthProvider---');
  // console.log(authUsr);

  useEffect(() => {
    if (!authAccessToken) return;
    updateAuthUser(authAccessToken);
  }, [authAccessToken, updateAuthUser]);

  return null;
};

export default AuthProvider;
