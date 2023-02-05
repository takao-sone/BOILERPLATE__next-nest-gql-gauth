import { AppDialogElements } from 'components/common/AppDialogElements';
import { AppErrorBoundary } from 'components/common/AppErrorBoundary';
import { AppSnackbarElement } from 'components/common/AppSnackbarElement';
import { DialogPortalDOMId } from 'global-states/dialog-portal-dom.state';
import { SnackbarPortalDOMId } from 'global-states/snackbar-portal-dom.state';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import AuthProvider from 'providers/AuthProvider';
import { ReactElement, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <RecoilRoot>
        <ReactQueryProvider>
          <MuiProvider>
            <AuthProvider />
            <AppDialogElements />
            <AppSnackbarElement />
            <AppErrorBoundary>{getLayout(<Component {...pageProps} />)}</AppErrorBoundary>
          </MuiProvider>
        </ReactQueryProvider>
      </RecoilRoot>
      <div id={DialogPortalDOMId} />
      <div id={SnackbarPortalDOMId} />
    </>
  );
};

export default MyApp;
