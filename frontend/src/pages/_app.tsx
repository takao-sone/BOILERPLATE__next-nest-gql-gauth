import type { AppProps } from 'next/app';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <ReactQueryProvider>
        <MuiProvider>
          <Component {...pageProps} />
        </MuiProvider>
      </ReactQueryProvider>
    </>
  );
};

export default MyApp;
