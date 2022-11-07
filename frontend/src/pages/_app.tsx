import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';
import CSR from 'components/common/CSR';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <CSR>
        <RecoilRoot>
          <ReactQueryProvider>
            <MuiProvider>
              <Component {...pageProps} />
            </MuiProvider>
          </ReactQueryProvider>
        </RecoilRoot>
      </CSR>
    </>
  );
};

export default MyApp;
