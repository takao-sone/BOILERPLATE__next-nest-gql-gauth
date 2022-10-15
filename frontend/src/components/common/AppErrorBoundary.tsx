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
const DEFAULT_MESSAGES: StatusMessages = { 0: ERROR_TEXT.API_500 };

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

  static getDerivedStateFromError = (error: APIError): State => ({
    hasError: true,
    error,
  });

  componentDidCatch(error: APIError, errorInfo: ErrorInfo) {
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

      if (error?.message) {
        return <div>{error.message}</div>;
      }

      return <div>{messages[0]}</div>;
    }

    return children;
  };
}

export default AppErrorBoundary;
