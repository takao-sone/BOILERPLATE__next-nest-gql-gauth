import { ClientError } from 'graphql-request';
import { ApiError } from 'next/dist/server/api-utils';
import { PureComponent, ReactNode } from 'react';
import { convertClientErrorToAPIError, DEFAULT_MESSAGES, StatusMessages } from 'utils/error';

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

class AppErrorBoundary extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError = (e: unknown): State => {
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

      if (error?.message) {
        return <div>{error.message}</div>;
      }

      return <div>{messages[0]}</div>;
    }

    return children;
  };
}

export default AppErrorBoundary;
