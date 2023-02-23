import { useGoogleLogin, useGoogleLogout, useGoogleRegisterUser } from 'fetchers';
import { GoogleLoginInput, GoogleRegisterInput } from 'generated/graphql';
import { useSetAuthAccessToken } from 'global-states/auth-access-token.state';
import { useSetAuthUser, useUpdateAuthUser } from 'global-states/auth-user.state';
import { useSetAppSnackbar } from 'global-states/snackbar.state';
import { ClientError } from 'graphql-request';
import { useCallback } from 'react';
import { convertClientErrorToAPIError, ERROR_TEXT } from 'utils/error';

export const useHandleRegisterCredentialResponse = () => {
  const { mutateAsync: mutateAsyncForRegister } = useGoogleRegisterUser();
  const setAuthAccessToken = useSetAuthAccessToken();
  const updateAuthUser = useUpdateAuthUser();
  const setAppSnackbar = useSetAppSnackbar();

  return useCallback(
    async (response: any) => {
      const data: GoogleRegisterInput = { credential: response.credential };
      let accessToken: string;
      try {
        const { googleRegisterUser } = await mutateAsyncForRegister({ data });
        accessToken = googleRegisterUser.accessToken;
      } catch (err) {
        if (err instanceof ClientError) {
          const apiError = convertClientErrorToAPIError(err);
          setAppSnackbar({
            severity: 'error',
            message: apiError.message,
          });
          return;
        }
        if (err instanceof Error) {
          setAppSnackbar({
            severity: 'error',
            message: ERROR_TEXT.API_UNKNOWN,
          });
          return;
        }
        throw err;
      }

      try {
        setAuthAccessToken(accessToken);
        await updateAuthUser(accessToken);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
        }
        console.error(err);
      }

      setAppSnackbar({
        severity: 'success',
        message: 'ユーザー登録に成功しました',
      });
    },
    [mutateAsyncForRegister, setAuthAccessToken, updateAuthUser, setAppSnackbar],
  );
};

export const useHandleLoginCredentialResponse = () => {
  const { mutateAsync: mutateAsyncForLogin } = useGoogleLogin();
  const setAuthAccessToken = useSetAuthAccessToken();
  const updateAuthUser = useUpdateAuthUser();
  const setAppSnackbar = useSetAppSnackbar();

  return useCallback(
    async (response: any) => {
      const data: GoogleLoginInput = { credential: response.credential };
      let accessToken: string;
      try {
        const { googleLogin } = await mutateAsyncForLogin({ data });
        accessToken = googleLogin.accessToken;
      } catch (err) {
        if (err instanceof ClientError) {
          const apiError = convertClientErrorToAPIError(err);
          setAppSnackbar({
            severity: 'error',
            message: apiError.message,
          });
          return;
        }
        if (err instanceof Error) {
          setAppSnackbar({
            severity: 'error',
            message: ERROR_TEXT.API_UNKNOWN,
          });
          return;
        }
        throw err;
      }

      try {
        setAuthAccessToken(accessToken);
        await updateAuthUser(accessToken);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
        }
        console.error(err);
      }

      setAppSnackbar({
        severity: 'success',
        message: 'ログインしました',
      });
    },
    [mutateAsyncForLogin, setAuthAccessToken, updateAuthUser, setAppSnackbar],
  );
};

export const useHandleLogout = () => {
  const { mutateAsync: mutateAsyncForLogout } = useGoogleLogout();
  const setAuthAccessToken = useSetAuthAccessToken();
  const setAuthUser = useSetAuthUser();
  const setAppSnackbar = useSetAppSnackbar();

  return useCallback(async () => {
    try {
      await mutateAsyncForLogout({});
    } catch (err) {
      if (err instanceof ClientError) {
        setAppSnackbar({
          severity: 'error',
          message: ERROR_TEXT.API_401_LOGOUT,
        });
        return;
      }
      if (err instanceof Error) {
        setAppSnackbar({
          severity: 'error',
          message: ERROR_TEXT.API_UNKNOWN,
        });
        return;
      }
      throw err;
    }
    setAuthAccessToken(null);
    setAuthUser(null);

    setAppSnackbar({
      severity: 'success',
      message: 'ログアウトしました',
    });
  }, [mutateAsyncForLogout, setAuthAccessToken, setAuthUser, setAppSnackbar]);
};
