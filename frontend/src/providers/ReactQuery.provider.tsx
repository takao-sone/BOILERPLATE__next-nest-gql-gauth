import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, ReactNode } from 'react';
import { isDevelopment } from '../utils/env';

type Props = {
  children?: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      // MEMO: React18の機能が正式実装されたらSuspenseで対応する
      // suspense: true
    },
    mutations: {
      retry: 0,
    },
  },
});

const ReactQueryProvider: FC<Props> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {isDevelopment() && <ReactQueryDevtools />}
      {props.children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
