import { Container, Stack, Typography } from '@mui/material';
import { GoogleIdentity } from 'components/common/GoogleIdentity';
import { LoggedInInfo } from 'components/common/LoggedInInfo';
import { SEO } from 'components/common/SEO';
import { AppLayout } from 'components/layout/AppLayout';
import { useAuthUserValue } from 'global-states/auth-user.state';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

type Props = {};

const AppLoginPage: NextPageWithLayout<Props> = () => {
  const authUser = useAuthUserValue();

  return (
    <Container sx={{ height: '300px', display: 'grid', placeContent: 'center' }}>
      <SEO pageTitle="ログイン" pageDescription="ログインページ" />
      <Stack justifyContent="center" alignItems="center" spacing={2}>
        {authUser ? (
          <LoggedInInfo authUser={authUser} />
        ) : (
          <>
            <Typography>Googleアカウントを使用してログインしてください</Typography>
            <GoogleIdentity buttonType="LOGIN" />
          </>
        )}
      </Stack>
    </Container>
  );
};

AppLoginPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default AppLoginPage;
