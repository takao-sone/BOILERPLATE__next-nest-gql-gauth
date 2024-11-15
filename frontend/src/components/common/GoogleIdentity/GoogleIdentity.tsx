import { Box, Button } from '@mui/material';
import { useAuthUserValue } from 'global-states/auth-user.state';
import { FC, useEffect } from 'react';
import { GI_BUTTON_TYPE, RENDERED_BUTTON_ID } from './GoogleIdentity.const';
import {
  useHandleLoginCredentialResponse,
  useHandleLogout,
  useHandleRegisterCredentialResponse,
} from './GoogleIdentity.hook';

type Props = {
  buttonType: keyof typeof GI_BUTTON_TYPE;
};

const GoogleIdentity: FC<Props> = ({ buttonType }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
  const authUser = useAuthUserValue();
  const handleRegisterCredentialResponse = useHandleRegisterCredentialResponse();
  const handleLoginCredentialResponse = useHandleLoginCredentialResponse();
  const handleLogout = useHandleLogout();

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
  }, [buttonType, googleClientId, handleLoginCredentialResponse, handleRegisterCredentialResponse]);

  return (
    <>
      {authUser && (
        <div>
          <Button variant="outlined" sx={{ fontWeight: 'bold' }} onClick={handleLogout}>
            ログアウト
          </Button>
        </div>
      )}
      <Box id={RENDERED_BUTTON_ID} hidden={!!authUser} mt={3} sx={{ height: '50px' }} />
    </>
  );
};

export default GoogleIdentity;
