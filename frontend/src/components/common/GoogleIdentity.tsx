import { useGoogleLogin, useGoogleLogout, useGoogleRegisterUser } from 'fetchers';
import { GoogleLoginInput, GoogleRegisterInput } from 'generated/graphql';
import { useSetAuthAccessToken } from 'global-states/auth-access-token-state';
import { useAuthUser } from 'global-states/auth-user-state';
import { FC, useEffect } from 'react';

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
  const { mutateAsync: mutateAsyncForLogout } = useGoogleLogout();
  const setAuthAccessToken = useSetAuthAccessToken();
  const { authUser, setAuthUser, updateAuthUser } = useAuthUser();

  const handleRegisterCredentialResponse = async (response: any) => {
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
  };

  const handleLoginCredentialResponse = async (response: any) => {
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
  };

  const handleLogout = async () => {
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
  };

  useEffect(() => {
    const isRegister = buttonType === GI_BUTTON_TYPE.REGISTER;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
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
    };
  });

  return (
    <div>
      {authUser ? (
        <div>
          <div>{authUser.displayedId}</div>
          <div>
            <button onClick={handleLogout}>ログアウト</button>
          </div>
        </div>
      ) : (
        <div>
          <div>Not Logged in</div>
        </div>
      )}
      <div id={RENDERED_BUTTON_ID} hidden={!!authUser}></div>
    </div>
  );
};

export default GoogleIdentity;
