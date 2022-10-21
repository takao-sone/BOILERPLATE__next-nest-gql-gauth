import type { AppProps } from 'next/app';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <ReactQueryProvider>
        <MuiProvider>
          <Component {...pageProps} />
        </MuiProvider>
      </ReactQueryProvider>
    </>
  );
};

export default MyApp;
