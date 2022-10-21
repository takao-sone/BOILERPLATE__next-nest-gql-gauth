import type { AppProps } from 'next/app';
import Script from 'next/script';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <ReactQueryProvider>
        <MuiProvider>
          <Component {...pageProps} />
        </MuiProvider>
      </ReactQueryProvider>
    </>
  );
};

export default MyApp;
