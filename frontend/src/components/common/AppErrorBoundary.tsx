import { ClientError } from 'graphql-request';
import { ApiError } from 'next/dist/server/api-utils';
import { ErrorInfo, PureComponent, ReactNode } from 'react';

type StatusMessages = { [status: number]: string };
type Props = { statusMessages?: StatusMessages; children?: ReactNode };
type State = { hasError: boolean; error: APIError | null };

const ERROR_TEXT = {
  API_400: '入力された値が条件を満たしていません。',
  API_401: 'ログインしてません。サイト運用者のデータを表示します。',
  API_403: 'ユーザー登録はサイト運用者のみ可能です。',
  API_404: '該当のデータは見つかりませんでした。',
  API_409: '入力されたメールアドレスのユーザはすでに存在しています。',
  API_500: 'システムエラーです。しばらく待ってからアクセスしてください。',
} as const;
const DEFAULT_MESSAGES: StatusMessages = { 500: ERROR_TEXT.API_500 };

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

const convertClientErrorToAPIError = (e: ClientError) => {
  const { errors } = e.response;
  if (errors && errors[0]) {
    const extensions = errors[0].extensions as AppGraphQLErrorExtensions;
    return new ApiError(extensions.response.statusCode, extensions.response.message);
  }
  return new ApiError(500, 'ClientError: fail to convert to APIErrro.');
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

  componentDidCatch(error: APIError, errorInfo: ErrorInfo) {
    console.log('componentDidCatch=======================================');
    console.error(error, errorInfo);
  }

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
