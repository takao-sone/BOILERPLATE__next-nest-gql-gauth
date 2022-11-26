import AppErrorBoundary from 'components/common/AppErrorBoundary';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <RecoilRoot>
        <ReactQueryProvider>
          <MuiProvider>
            <AppErrorBoundary>
              <Component {...pageProps} />
            </AppErrorBoundary>
          </MuiProvider>
        </ReactQueryProvider>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
