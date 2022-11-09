import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  headers?: RequestInit['headers'],
) {
  return async (): Promise<TData> => client.request<TData, TVariables>(query, variables, headers);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type GoogleLoginInput = {
  /** フロントエンドのリクエストで発行されたGoogleのcredential（JWT） */
  credential: Scalars['String'];
};

export type GoogleRegisterInput = {
  /** フロントエンドのリクエストで発行されたGoogleのcredential（JWT） */
  credential: Scalars['String'];
};

export type GoogleTokenAuth = {
  __typename?: 'GoogleTokenAuth';
  /** アクセストークン */
  accessToken: Scalars['String'];
};

export type GoogleUser = {
  __typename?: 'GoogleUser';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** クライアントアプリケーション側へ表示するID */
  displayedId: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
  /** ユーザー連絡先情報 */
  userContactDetail: UserContactDetail;
  /** ユーザープロフィール情報 */
  userProfile: UserProfile;
  /** ユーザー権限 */
  userRole: Role;
  /** ユーザー認証情報 */
  userThirdPartyCredential: UserThirdPartyCredential;
};

export type GoogleUserConnection = {
  __typename?: 'GoogleUserConnection';
  /** edgeオブジェクト配列 */
  edges?: Maybe<Array<GoogleUserEdge>>;
  /** ページネーションに関する情報 */
  pageInfo: PageInfo;
  /** 指定した条件で取得できる最大データ数 */
  totalCount: Scalars['Int'];
};

export type GoogleUserEdge = {
  __typename?: 'GoogleUserEdge';
  /** 現在のnodeのカーソル */
  cursor: Scalars['String'];
  /** nodeオブジェクト */
  node: GoogleUser;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   *
   *       権限: ALL
   *
   *       Google Identityを使用したログインオペレーション
   *
   */
  googleLogin: GoogleTokenAuth;
  /**
   *
   *       権限: Logged-In
   *
   *       Google Identityを使用したログアウトオペレーション
   *
   */
  googleLogout: Scalars['String'];
  /**
   *
   *       権限: ALL
   *
   *       Google Identityを使用した新規ユーザー登録用オペレーション
   *
   */
  googleRegisterUser: GoogleTokenAuth;
  /**
   *
   *       権限: ALL
   *
   *       ログイン用オペレーション
   *
   */
  logIn: TokenAuth;
  /**
   *
   *       権限: ALL
   *
   *       ログアウト用オペレーション
   *
   */
  logOut?: Maybe<Scalars['String']>;
  /**
   *
   *       権限: ALL
   *
   *       トークン更新用オペレーション
   *
   */
  refreshTokens: TokenAuth;
};

export type MutationgoogleLoginArgs = {
  data: GoogleLoginInput;
};

export type MutationgoogleRegisterUserArgs = {
  data: GoogleRegisterInput;
};

export type MutationlogInArgs = {
  data: TokenLogInInput;
};

export type MutationlogOutArgs = {
  data: TokenLogOutInput;
};

export type MutationrefreshTokensArgs = {
  data: RefreshTokensInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** 最後に取得したデータのカーソル */
  endCursor?: Maybe<Scalars['String']>;
  /** 次のページの可否 */
  hasNextPage?: Maybe<Scalars['Boolean']>;
  /** 前のページの可否 */
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
  /** 最初に取得したデータのカーソル */
  startCursor?: Maybe<Scalars['String']>;
};

export type PaginationInput = {
  /** 起点となるカーソル(カーソル以降の値取得時) */
  after?: InputMaybe<Scalars['String']>;
  /** 起点となるカーソル(カーソル以前の値取得時) */
  before?: InputMaybe<Scalars['String']>;
  /** 値の取得数(カーソル以降の値取得時) */
  first?: InputMaybe<Scalars['Int']>;
  /** 値の取得数(カーソル以前の値取得時) */
  last?: InputMaybe<Scalars['Int']>;
  /** カーソルを含めた取得する値のスキップ数 */
  skip?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  /**
   *
   *       権限: Logged-In
   *
   *       現在ログインしているユーザーの情報
   *
   *
   */
  authenticatedUser: SessionUser;
  /**
   *
   *       権限: ADMIN
   *
   *       ページネーションによりロールを取得するオペレーション
   *
   *
   */
  roleConnection: RoleConnection;
  /**
   *
   *       権限: ALL
   *
   *       テスト
   *
   */
  testLoggedInGuard: Scalars['String'];
  /**
   *
   *       権限: ALL
   *
   *       テスト
   *
   */
  testRoleGuard: Scalars['String'];
  /**
   *
   *       権限: ADMIN
   *
   *       ユーザーのdisplayedIdによってユーザーを取得するオペレーション
   *
   *
   */
  user: GoogleUser;
  /**
   *
   *       権限: ADMIN
   *
   *       ページネーションによりユーザーを取得するオペレーション
   *
   *
   */
  userConnection: GoogleUserConnection;
};

export type QueryroleConnectionArgs = {
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<RoleSortInput>;
};

export type QueryuserArgs = {
  displayedId: Scalars['String'];
};

export type QueryuserConnectionArgs = {
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<UserSortInput>;
};

export type RefreshTokensInput = {
  /** リフレッシュトークン */
  refreshToken: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** クライアントアプリケーション側へ表示するID */
  displayedId: Scalars['String'];
  /** ロールの名前 */
  name: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
};

export type RoleConnection = {
  __typename?: 'RoleConnection';
  /** edgeオブジェクト配列 */
  edges?: Maybe<Array<RoleEdge>>;
  /** ページネーションに関する情報 */
  pageInfo: PageInfo;
  /** 指定した条件で取得できる最大データ数 */
  totalCount: Scalars['Int'];
};

export type RoleEdge = {
  __typename?: 'RoleEdge';
  /** 現在のnodeのカーソル */
  cursor: Scalars['String'];
  /** nodeオブジェクト */
  node: Role;
};

/** Properties by which role connections can be ordered. */
export const RoleSortField = {
  ID: 'ID',
} as const;

export type RoleSortField = typeof RoleSortField[keyof typeof RoleSortField];
export type RoleSortInput = {
  /** ソートする方向 */
  direction?: InputMaybe<SortDirection>;
  /** ロール取得する際にソート対象にしたいフィールド */
  field?: InputMaybe<RoleSortField>;
};

export type SessionUser = {
  __typename?: 'SessionUser';
  /** アクセストークン */
  displayedId: Scalars['String'];
  /** ユーザー連絡先情報 */
  userContactDetail: SessionUserContactDetail;
  /** ユーザープロフィール */
  userProfile: SessionUserProfile;
  /** ユーザー権限 */
  userRole: SessionUserRole;
};

export type SessionUserContactDetail = {
  __typename?: 'SessionUserContactDetail';
  /** メールアドレス */
  email: Scalars['String'];
};

export type SessionUserProfile = {
  __typename?: 'SessionUserProfile';
  /** ユーザー名 */
  name: Scalars['String'];
};

export type SessionUserRole = {
  __typename?: 'SessionUserRole';
  /** クライアントアプリケーション側へ表示するID */
  displayedId: Scalars['String'];
  /** ロールの名前 */
  name: Scalars['String'];
};

/** Possible directions in which to order a list of items when provided an `orderBy` argument. */
export const SortDirection = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];
export type TokenAuth = {
  __typename?: 'TokenAuth';
  /** アクセストークン */
  accessToken: Scalars['String'];
  /** リフレッシュトークン */
  refreshToken: Scalars['String'];
};

export type TokenLogInInput = {
  /** 登録したメールアドレス */
  email: Scalars['String'];
  /** 登録したパスワード */
  password: Scalars['String'];
};

export type TokenLogOutInput = {
  /** リフレッシュトークン */
  refreshToken: Scalars['String'];
};

export type UserContactDetail = {
  __typename?: 'UserContactDetail';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** メールアドレス */
  email: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** ユーザー名 */
  name: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
};

/** Properties by which user connections can be ordered. */
export const UserSortField = {
  CREATED_AT: 'CREATED_AT',
  ID: 'ID',
} as const;

export type UserSortField = typeof UserSortField[keyof typeof UserSortField];
export type UserSortInput = {
  /** ソートする方向 */
  direction?: InputMaybe<SortDirection>;
  /** ユーザー取得する際にソート対象にしたいフィールド */
  field?: InputMaybe<UserSortField>;
};

export type UserThirdPartyCredential = {
  __typename?: 'UserThirdPartyCredential';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** IDプロバイダー名 */
  provider: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
};

export type AuthenticatedUserQueryVariables = Exact<{ [key: string]: never }>;

export type AuthenticatedUserQuery = {
  __typename?: 'Query';
  authenticatedUser: {
    __typename?: 'SessionUser';
    displayedId: string;
    userContactDetail: { __typename?: 'SessionUserContactDetail'; email: string };
    userProfile: { __typename?: 'SessionUserProfile'; name: string };
    userRole: { __typename?: 'SessionUserRole'; displayedId: string; name: string };
  };
};

export type GoogleLoginMutationVariables = Exact<{
  data: GoogleLoginInput;
}>;

export type GoogleLoginMutation = {
  __typename?: 'Mutation';
  googleLogin: { __typename?: 'GoogleTokenAuth'; accessToken: string };
};

export type GoogleLogoutMutationVariables = Exact<{ [key: string]: never }>;

export type GoogleLogoutMutation = { __typename?: 'Mutation'; googleLogout: string };

export type GoogleRegisterUserMutationVariables = Exact<{
  data: GoogleRegisterInput;
}>;

export type GoogleRegisterUserMutation = {
  __typename?: 'Mutation';
  googleRegisterUser: { __typename?: 'GoogleTokenAuth'; accessToken: string };
};

export type LogInMutationVariables = Exact<{
  data: TokenLogInInput;
}>;

export type LogInMutation = {
  __typename?: 'Mutation';
  logIn: { __typename?: 'TokenAuth'; accessToken: string; refreshToken: string };
};

export const AuthenticatedUserDocument = `
    query AuthenticatedUser {
  authenticatedUser {
    displayedId
    userContactDetail {
      email
    }
    userProfile {
      name
    }
    userRole {
      displayedId
      name
    }
  }
}
    `;
export const useAuthenticatedUserQuery = <TData = AuthenticatedUserQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: AuthenticatedUserQueryVariables,
  options?: UseQueryOptions<AuthenticatedUserQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<AuthenticatedUserQuery, TError, TData>(
    variables === undefined ? ['AuthenticatedUser'] : ['AuthenticatedUser', variables],
    fetcher<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>(
      client,
      AuthenticatedUserDocument,
      variables,
      headers,
    ),
    options,
  );
useAuthenticatedUserQuery.fetcher = (
  client: GraphQLClient,
  variables?: AuthenticatedUserQueryVariables,
  headers?: RequestInit['headers'],
) =>
  fetcher<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>(
    client,
    AuthenticatedUserDocument,
    variables,
    headers,
  );
export const GoogleLoginDocument = `
    mutation GoogleLogin($data: GoogleLoginInput!) {
  googleLogin(data: $data) {
    accessToken
  }
}
    `;
export const useGoogleLoginMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<GoogleLoginMutation, TError, GoogleLoginMutationVariables, TContext>,
  headers?: RequestInit['headers'],
) =>
  useMutation<GoogleLoginMutation, TError, GoogleLoginMutationVariables, TContext>(
    ['GoogleLogin'],
    (variables?: GoogleLoginMutationVariables) =>
      fetcher<GoogleLoginMutation, GoogleLoginMutationVariables>(
        client,
        GoogleLoginDocument,
        variables,
        headers,
      )(),
    options,
  );
useGoogleLoginMutation.fetcher = (
  client: GraphQLClient,
  variables: GoogleLoginMutationVariables,
  headers?: RequestInit['headers'],
) =>
  fetcher<GoogleLoginMutation, GoogleLoginMutationVariables>(
    client,
    GoogleLoginDocument,
    variables,
    headers,
  );
export const GoogleLogoutDocument = `
    mutation GoogleLogout {
  googleLogout
}
    `;
export const useGoogleLogoutMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    GoogleLogoutMutation,
    TError,
    GoogleLogoutMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers'],
) =>
  useMutation<GoogleLogoutMutation, TError, GoogleLogoutMutationVariables, TContext>(
    ['GoogleLogout'],
    (variables?: GoogleLogoutMutationVariables) =>
      fetcher<GoogleLogoutMutation, GoogleLogoutMutationVariables>(
        client,
        GoogleLogoutDocument,
        variables,
        headers,
      )(),
    options,
  );
useGoogleLogoutMutation.fetcher = (
  client: GraphQLClient,
  variables?: GoogleLogoutMutationVariables,
  headers?: RequestInit['headers'],
) =>
  fetcher<GoogleLogoutMutation, GoogleLogoutMutationVariables>(
    client,
    GoogleLogoutDocument,
    variables,
    headers,
  );
export const GoogleRegisterUserDocument = `
    mutation GoogleRegisterUser($data: GoogleRegisterInput!) {
  googleRegisterUser(data: $data) {
    accessToken
  }
}
    `;
export const useGoogleRegisterUserMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    GoogleRegisterUserMutation,
    TError,
    GoogleRegisterUserMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers'],
) =>
  useMutation<GoogleRegisterUserMutation, TError, GoogleRegisterUserMutationVariables, TContext>(
    ['GoogleRegisterUser'],
    (variables?: GoogleRegisterUserMutationVariables) =>
      fetcher<GoogleRegisterUserMutation, GoogleRegisterUserMutationVariables>(
        client,
        GoogleRegisterUserDocument,
        variables,
        headers,
      )(),
    options,
  );
useGoogleRegisterUserMutation.fetcher = (
  client: GraphQLClient,
  variables: GoogleRegisterUserMutationVariables,
  headers?: RequestInit['headers'],
) =>
  fetcher<GoogleRegisterUserMutation, GoogleRegisterUserMutationVariables>(
    client,
    GoogleRegisterUserDocument,
    variables,
    headers,
  );
export const LogInDocument = `
    mutation LogIn($data: TokenLogInInput!) {
  logIn(data: $data) {
    accessToken
    refreshToken
  }
}
    `;
export const useLogInMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<LogInMutation, TError, LogInMutationVariables, TContext>,
  headers?: RequestInit['headers'],
) =>
  useMutation<LogInMutation, TError, LogInMutationVariables, TContext>(
    ['LogIn'],
    (variables?: LogInMutationVariables) =>
      fetcher<LogInMutation, LogInMutationVariables>(client, LogInDocument, variables, headers)(),
    options,
  );
useLogInMutation.fetcher = (
  client: GraphQLClient,
  variables: LogInMutationVariables,
  headers?: RequestInit['headers'],
) => fetcher<LogInMutation, LogInMutationVariables>(client, LogInDocument, variables, headers);
