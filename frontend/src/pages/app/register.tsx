import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GoogleIdentity } from 'components/common/GoogleIdentity';
import { LoggedInInfo } from 'components/common/LoggedInInfo';
import { SEO } from 'components/common/SEO';
import { AppLayout } from 'components/layout/AppLayout';
import { useAuthUserValue } from 'global-states/auth-user.state';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

type Props = {};

const AppRegisterPage: NextPageWithLayout<Props> = () => {
  const authUser = useAuthUserValue();

  return (
    <Container
      sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <SEO pageTitle="アカウント登録" pageDescription="アカウント登録ページ" />
      <Stack justifyContent="center" alignItems="center" spacing={2}>
        {authUser ? (
          <LoggedInInfo authUser={authUser} />
        ) : (
          <>
            <Typography>Googleアカウントを使用してアカウント登録してください</Typography>
            <GoogleIdentity buttonType="REGISTER" />
          </>
        )}
      </Stack>
    </Container>
  );
};

AppRegisterPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default AppRegisterPage;
