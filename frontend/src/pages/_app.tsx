import AppErrorBoundary from 'components/common/AppErrorBoundary';
import type { AppProps } from 'next/app';
import AuthProvider from 'providers/AuthProvider';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <RecoilRoot>
        <AuthProvider />
        <Suspense fallback={<div>Loading...</div>}>
          <ReactQueryProvider>
            <MuiProvider>
              <AppErrorBoundary>
                <Component {...pageProps} />
              </AppErrorBoundary>
            </MuiProvider>
          </ReactQueryProvider>
        </Suspense>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
