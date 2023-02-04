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
      // suspense: true,
      // useErrorBoundary: true,
    },
    mutations: {
      retry: 0,
      // useErrorBoundary: true,
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
