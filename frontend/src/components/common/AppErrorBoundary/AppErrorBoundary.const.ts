import { StatusMessages } from './AppErrorBoundary';

export const ERROR_TEXT = {
  API_400: '入力された値が条件を満たしていません。',
  API_401: 'ログインしてません。サイト運用者のデータを表示します。',
  API_403: 'ユーザー登録はサイト運用者のみ可能です。',
  API_404: '該当のデータは見つかりませんでした。',
  API_409: '入力されたメールアドレスのユーザはすでに存在しています。',
  API_500: 'システムエラーです。しばらく待ってからアクセスしてください。',
} as const;

export const DEFAULT_MESSAGES: StatusMessages = { 500: ERROR_TEXT.API_500 };
