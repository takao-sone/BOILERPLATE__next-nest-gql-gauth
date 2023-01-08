import { ClientError } from 'graphql-request';
import { ApiError } from 'next/dist/server/api-utils';
import { PureComponent, ReactNode } from 'react';
import { DEFAULT_MESSAGES } from './AppErrorBoundary.const';
import { convertClientErrorToAPIError } from './AppErrorBoundary.util';

export type StatusMessages = { [status: number]: string };
type Props = { statusMessages?: StatusMessages; children?: ReactNode };
type State = { hasError: boolean; error: APIError | null };

export class APIError extends Error {
  statusCode: number;
  constructor(statusCode: number, message?: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'API Error';
  }
}

export type AppGraphQLErrorExtensions = {
  code: string;
  response: {
    statusCode: number;
    message: string;
    error: string;
  };
};

class AppErrorBoundary extends PureComponent<Props, State> {
  constructor(props: Props) {
    console.log('constructor======================================');
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError = (e: unknown): State => {
    console.log('getDerivedStateFromError=======================================');
    if (e instanceof ClientError) {
      return {
        hasError: true,
        error: convertClientErrorToAPIError(e),
      };
    }
    if (e instanceof Error) {
      return {
        hasError: true,
        error: new ApiError(500, e.message),
      };
    }
    // Not expected, because e should be derived from Error object.
    return {
      hasError: false,
      error: null,
    };
  };

  render = (): ReactNode => {
    const { children, statusMessages = {} } = this.props;
    const { hasError, error } = this.state;
    const messages = { ...DEFAULT_MESSAGES, ...statusMessages };

    if (hasError) {
      const statusCode = error?.statusCode;

      if (statusCode && Object.keys(messages).includes(String(statusCode))) {
        return <div>{messages[statusCode]}</div>;
      }

      console.log('1=======================================');
      if (error?.message) {
        return <div>{error.message}</div>;
      }

      console.log('2=======================================');
      return <div>{messages[0]}</div>;
    }

    console.log('3=======================================');
    return children;
  };
}

export default AppErrorBoundary;