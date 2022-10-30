import { FC, useEffect } from 'react';
import { useGoogleLogin, useGoogleRegisterUser } from 'fetchers';
import { GoogleLoginInput, GoogleRegisterInput } from 'generated/graphql';

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

  const handleRegisterCredentialResponse = async (response: any) => {
    const data: GoogleRegisterInput = { credential: response.credential };
    const {
      googleRegisterUser: { accessToken },
    } = await mutateAsyncForRegister({ data });

    // TODO: 保存失敗した際の挙動が決めきれていない
    try {
      localStorage.setItem('accessToken', accessToken);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }

    // TODO
    // ユーザー情報を取得
  };

  const handleLoginCredentialResponse = async (response: any) => {
    const data: GoogleLoginInput = { credential: response.credential };
    const {
      googleLogin: { accessToken },
    } = await mutateAsyncForLogin({ data });

    // TODO: 保存失敗した際の挙動が決めきれていない
    try {
      localStorage.setItem('accessToken', accessToken);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }

    // TODO
    // ユーザー情報を取得
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
      text: isRegister ? 'signup_with' : 'signin_with',
    });
  });

  return (
    <div>
      <div id={RENDERED_BUTTON_ID}></div>
    </div>
  );
};

export default GoogleIdentity;
