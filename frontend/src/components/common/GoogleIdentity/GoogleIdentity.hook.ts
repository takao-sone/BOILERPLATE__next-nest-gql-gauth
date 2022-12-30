import { useGoogleLogin, useGoogleLogout, useGoogleRegisterUser } from 'fetchers';
import { GoogleLoginInput, GoogleRegisterInput } from 'generated/graphql';
import { useSetAuthAccessToken } from 'global-states/auth-access-token.state';
import { useAuthUser } from 'global-states/auth-user.state';
import { useCallback } from 'react';

export const useHandleRegisterCredentialResponse = () => {
  const { mutateAsync: mutateAsyncForRegister } = useGoogleRegisterUser();
  const setAuthAccessToken = useSetAuthAccessToken();
  const { updateAuthUser } = useAuthUser();

  return useCallback(
    async (response: any) => {
      // TODO: ===後で消す===
      console.log(response);

      const data: GoogleRegisterInput = { credential: response.credential };
      const {
        googleRegisterUser: { accessToken },
      } = await mutateAsyncForRegister({ data });

      // TODO: 保存失敗した際の挙動が決めきれていない
      try {
        setAuthAccessToken(accessToken);
        await updateAuthUser(accessToken);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
        throw err;
      }
    },
    [mutateAsyncForRegister, setAuthAccessToken, updateAuthUser],
  );
};

export const useHandleLoginCredentialResponse = () => {
  const { mutateAsync: mutateAsyncForLogin } = useGoogleLogin();
  const setAuthAccessToken = useSetAuthAccessToken();
  const { updateAuthUser } = useAuthUser();

  return useCallback(
    async (response: any) => {
      // TODO: ===後で消す===
      console.log(response);

      const data: GoogleLoginInput = { credential: response.credential };
      const {
        googleLogin: { accessToken },
      } = await mutateAsyncForLogin({ data });

      // TODO: 保存失敗した際の挙動が決めきれていない
      try {
        setAuthAccessToken(accessToken);
        await updateAuthUser(accessToken);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
        throw err;
      }
    },
    [mutateAsyncForLogin, setAuthAccessToken, updateAuthUser],
  );
};

export const useHandleLogout = () => {
  const { mutateAsync: mutateAsyncForLogout } = useGoogleLogout();
  const setAuthAccessToken = useSetAuthAccessToken();
  const { setAuthUser } = useAuthUser();

  return useCallback(async () => {
    try {
      await mutateAsyncForLogout({});
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }
    setAuthAccessToken(null);
    setAuthUser(null);
  }, [mutateAsyncForLogout, setAuthAccessToken, setAuthUser]);
};
