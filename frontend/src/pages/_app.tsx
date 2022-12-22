import { AppDialogElements } from 'components/common/AppDialogElements';
import { AppErrorBoundary } from 'components/common/AppErrorBoundary';
import { DialogPortalDOMId } from 'global-states/dialog-portal-dom.state';
import type { AppProps } from 'next/app';
import AuthProvider from 'providers/AuthProvider';
import { RecoilRoot } from 'recoil';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <RecoilRoot>
        <ReactQueryProvider>
          <MuiProvider>
            <AuthProvider />
            <AppDialogElements />
            <AppErrorBoundary>
              <Component {...pageProps} />
            </AppErrorBoundary>
          </MuiProvider>
        </ReactQueryProvider>
      </RecoilRoot>
      <div id={DialogPortalDOMId} />
    </>
  );
};

export default MyApp;
