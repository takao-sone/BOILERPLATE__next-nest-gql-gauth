import type { AppProps } from 'next/app';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    // @ts-ignore TODO v18のchildren系エラー
    <ReactQueryProvider>
      {/* @ts-ignore TODO v18のchildren系エラー */}
      <MuiProvider>
        <Component {...pageProps} />
      </MuiProvider>
    </ReactQueryProvider>
  );
};

export default MyApp;
