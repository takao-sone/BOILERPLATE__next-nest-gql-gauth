import { FC, useEffect } from 'react';
import { useGoogleRegisterUser } from 'fetchers';
import { GoogleRegisterInput } from 'generated/graphql';

const RENDERED_BUTTON_ID = 'login-with-google';

type Props = {
  buttonType: 'REGISTER' | 'LOGIN';
};

const GoogleIdentity: FC<Props> = ({ buttonType }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
  const { mutateAsync } = useGoogleRegisterUser();

  const handleCredentialResponse = async (response: any) => {
    const { credential } = response;

    const googleRegisterUserInput: GoogleRegisterInput = {
      credential,
    };

    const { googleRegisterUser } = await mutateAsync({ data: googleRegisterUserInput });
    console.log('----------------');
    console.log(googleRegisterUser);
  };

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
