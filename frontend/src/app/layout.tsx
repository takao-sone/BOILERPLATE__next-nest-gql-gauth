import AppErrorBoundary from 'components/common/AppErrorBoundary';
import AuthProvider from 'providers/AuthProvider';
import { FC, ReactNode, Suspense } from 'react';
import MuiProvider from '../providers/Mui.provider';
import ReactQueryProvider from '../providers/ReactQuery.provider';
import RecoilWrapper from './RecoilWrapper';

type Props = {
  children?: ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  return (
    <html lang="ja">
      <body>
        <RecoilWrapper>
          <AuthProvider />
          <Suspense fallback={<div>Loading...</div>}>
            <ReactQueryProvider>
              <MuiProvider>
                <AppErrorBoundary>{children}</AppErrorBoundary>
              </MuiProvider>
            </ReactQueryProvider>
          </Suspense>
        </RecoilWrapper>
      </body>
    </html>
  );
};

export default Layout;
