import { ClientError } from 'graphql-request';
import { ApiError } from 'next/dist/server/api-utils';

export type StatusMessages = { [status: number]: string };

export type AppGraphQLErrorExtensions = {
  code: string;
  response: {
    statusCode: number;
    message: string;
    error: string;
  };
};

export const ERROR_TEXT = {
  API_400: '入力された値が条件を満たしていません',
  API_401_AUTH: 'ユーザー認証に失敗しました',
  API_401_LOGOUT: 'ログアウトに失敗しました',
  API_403: 'ユーザー登録はサイト運用者のみ可能です',
  API_404: '該当のデータは見つかりませんでした',
  API_409: '入力されたメールアドレスのユーザはすでに存在しています',
  API_500: 'システムエラーです、しばらく待ってからアクセスしてください',
  API_UNKNOWN: 'システムエラーです、しばらく待ってからアクセスしてください',
} as const;

export const DEFAULT_MESSAGES: StatusMessages = {
  400: ERROR_TEXT.API_400,
  401: ERROR_TEXT.API_401_AUTH,
  500: ERROR_TEXT.API_500,
};

export const convertClientErrorToAPIError = (e: ClientError) => {
  const { errors } = e.response;
  if (errors && errors[0]) {
    const extensions = errors[0].extensions as AppGraphQLErrorExtensions;
    const { statusCode } = extensions.response;
    return new ApiError(statusCode, DEFAULT_MESSAGES[statusCode] || ERROR_TEXT.API_UNKNOWN);
  }
  return new ApiError(500, 'ClientError: fail to convert to APIErrro.');
};
