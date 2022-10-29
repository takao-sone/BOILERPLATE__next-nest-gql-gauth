import { FC, useEffect } from 'react';
import { useGoogleRegisterUser } from 'fetchers';
import { GoogleRegisterInput } from 'generated/graphql';

const RENDERED_BUTTON_ID = 'login-with-google';

type Props = {
  buttonType: 'REGISTER' | 'LOGIN';
};

const GoogleIdentity: FC<Props> = ({ buttonType }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
  // TODO: 登録
  const { mutateAsync } = useGoogleRegisterUser();

  const handleCredentialResponse = async (response: any) => {
    const { credential } = response;
    const googleRegisterUserInput: GoogleRegisterInput = {
      credential,
    };
    const { googleRegisterUser } = await mutateAsync({ data: googleRegisterUserInput });

    // TODO: 保存失敗した際の挙動が決めきれていない
    // localStorageにaccessTokenを保存
    try {
      localStorage.setItem('accessToken', googleRegisterUser.accessToken);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }

    // ユーザー情報を取得
  };

  // TODO: ログイン
  // const { mutateAsync } = useGoogleLogin();

  // const handleCredentialResponse = async (response: any) => {
  //   const { credential } = response;
  //   const googleLoginInput: GoogleLoginInput = {
  //     credential,
  //   };
  //   const { googleLogin } = await mutateAsync({ data: googleLoginInput });

  //   // TODO: 保存失敗した際の挙動が決めきれていない
  //   // localStorageにaccessTokenを保存
  //   try {
  //     localStorage.setItem('accessToken', googleLogin.accessToken);
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       throw new Error(err.message);
  //     }
  //     throw err;
  //   }

  //   // ユーザー情報を取得
  // };

  useEffect(() => {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleCredentialResponse,
    });

    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById(RENDERED_BUTTON_ID), {
      theme: 'outline',
      size: 'large',
      text: buttonType === 'REGISTER' ? 'Googleで登録' : 'Googleでログイン',
    });
  });

  return (
    <div>
      <div id={RENDERED_BUTTON_ID}></div>
    </div>
  );
};

export default GoogleIdentity;
