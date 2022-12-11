import AppErrorBoundary from 'components/common/AppErrorBoundary';
import AuthProvider from 'providers/AuthProvider';
import { FC, ReactNode } from 'react';
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
          <ReactQueryProvider>
            <MuiProvider>
              <AppErrorBoundary>{children}</AppErrorBoundary>
            </MuiProvider>
          </ReactQueryProvider>
        </RecoilWrapper>
      </body>
    </html>
  );
};

export default Layout;
