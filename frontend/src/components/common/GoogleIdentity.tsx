import { FC, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useGoogleLogin, useGoogleRegisterUser } from 'fetchers';
import { GoogleLoginInput, GoogleRegisterInput } from 'generated/graphql';
import { authUserState, useSetAuthAccessToken } from 'global-states/auth-state';

const RENDERED_BUTTON_ID = 'login-with-google';

export const GI_BUTTON_TYPE = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
} as const;

type Props = {
  buttonType: keyof typeof GI_BUTTON_TYPE;
};

const GoogleIdentity: FC<Props> = ({ buttonType }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
  const { mutateAsync: mutateAsyncForRegister } = useGoogleRegisterUser();
  const { mutateAsync: mutateAsyncForLogin } = useGoogleLogin();
  const setAuthAccessToken = useSetAuthAccessToken();
  const authUser = useRecoilValue(authUserState);

  const handleRegisterCredentialResponse = async (response: any) => {
    const data: GoogleRegisterInput = { credential: response.credential };
    const {
      googleRegisterUser: { accessToken },
    } = await mutateAsyncForRegister({ data });

    // TODO: 保存失敗した際の挙動が決めきれていない
    try {
      setAuthAccessToken(accessToken);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }
  };

  const handleLoginCredentialResponse = async (response: any) => {
    const data: GoogleLoginInput = { credential: response.credential };
    const {
      googleLogin: { accessToken },
    } = await mutateAsyncForLogin({ data });

    // TODO: 保存失敗した際の挙動が決めきれていない
    try {
      setAuthAccessToken(accessToken);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }
  };

  useEffect(() => {
    const isRegister = buttonType === GI_BUTTON_TYPE.REGISTER;
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: isRegister ? handleRegisterCredentialResponse : handleLoginCredentialResponse,
    });
    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById(RENDERED_BUTTON_ID), {
      type: 'standard',
      theme: 'outline',
      size: 'medium',
      width: 300,
      text: isRegister ? 'signup_with' : 'signin_with',
    });
  });

  return (
    <div>
      {authUser ? (
        <div>
          <div>{authUser.displayedId}</div>
          <div id={RENDERED_BUTTON_ID}></div>
        </div>
      ) : (
        <div id={RENDERED_BUTTON_ID}></div>
      )}
    </div>
  );
};

export default GoogleIdentity;
