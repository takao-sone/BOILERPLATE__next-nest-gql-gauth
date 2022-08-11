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

export type Auth = {
  __typename?: 'Auth';
  /** ログインしているユーザーの情報 */
  authenticatedUser: User;
};

export type CreateUserInput = {
  /** 確認用パスワード */
  confirmationPassword: Scalars['String'];
  /** メールアドレス */
  email: Scalars['String'];
  /** パスワード（8~64文字） */
  password: Scalars['String'];
  /** ユーザーに付与する権限のdisplayedId */
  roleDisplayedId: Scalars['String'];
};

export type LogInInput = {
  /** 登録したメールアドレス */
  email: Scalars['String'];
  /** 登録したパスワード */
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   *
   *       権限: ADMIN
   *
   *       ユーザーを作成するオペレーション
   *
   */
  createUser: User;
  /**
   *
   *       権限: ALL
   *
   *       ログイン用オペレーション
   *
   */
  logIn: Auth;
  /**
   *
   *       権限: ログイン
   *
   *       ログアウト用オペレーション
   *
   */
  logOut: Scalars['String'];
  /**
   *
   *       権限: ALL
   *
   *       ログイン用オペレーション
   *
   */
  tokenLogIn: TokenAuth;
  /**
   *
   *       権限: ALL
   *
   *       ログアウト用オペレーション
   *
   */
  tokenLogOut?: Maybe<Scalars['String']>;
  /**
   *
   *       権限: ログイン
   *
   *       ユーザーのメールアドレスを更新するオペレーション
   *
   */
  updateUserEmail: User;
  /**
   *
   *       権限: ADMIN
   *
   *       ユーザーの権限を更新するオペレーション
   *
   *       自分自身の権限は更新できない
   *
   */
  updateUserRole: User;
};

export type MutationcreateUserArgs = {
  data: CreateUserInput;
};

export type MutationlogInArgs = {
  data: LogInInput;
};

export type MutationtokenLogInArgs = {
  data: TokenLogInInput;
};

export type MutationtokenLogOutArgs = {
  data: TokenLogOutInput;
};

export type MutationupdateUserEmailArgs = {
  data: UpdateUserEmailInput;
};

export type MutationupdateUserRoleArgs = {
  data: UpdateUserRoleInput;
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
   *       権限: ログイン
   *
   *       ログイン中のユーザー情報を取得するオペレーション
   *
   */
  getAuthenticatedUser: Auth;
  /**
   *
   *       権限: ADMIN
   *
   *       ページネーションによりユーザーを取得するオペレーション
   *
   *
   */
  getUserConnection: UserConnection;
};

export type QuerygetUserConnectionArgs = {
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<UserSortInput>;
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

export type UpdateUserEmailInput = {
  /** 新しいメールアドレス */
  newEmail: Scalars['String'];
};

export type UpdateUserRoleInput = {
  /** 更新対象ユーザーの新しい権限のdisplaydId */
  newRoleDisplayedId: Scalars['String'];
  /** 更新対象ユーザーのdisplayedId */
  updateTargetUserDisplayedId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** クライアントアプリケーション側へ表示するID */
  displayedId: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
  /** ユーザー認証情報 */
  userCredential: UserCredential;
  /** ユーザー権限 */
  userRole: Role;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  /** edgeオブジェクト配列 */
  edges?: Maybe<Array<UserEdge>>;
  /** ページネーションに関する情報 */
  pageInfo: PageInfo;
  /** 指定した条件で取得できる最大データ数 */
  totalCount: Scalars['Int'];
};

export type UserCredential = {
  __typename?: 'UserCredential';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** メールアドレス */
  email: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  /** 現在のnodeのカーソル */
  cursor: Scalars['String'];
  /** nodeオブジェクト */
  node: User;
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

export type GetUserConnectionQueryVariables = Exact<{
  sort?: InputMaybe<UserSortInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetUserConnectionQuery = {
  __typename?: 'Query';
  getUserConnection: {
    __typename?: 'UserConnection';
    totalCount: number;
    edges?: Array<{
      __typename?: 'UserEdge';
      node: {
        __typename?: 'User';
        displayedId: string;
        userCredential: { __typename?: 'UserCredential'; email: string };
        userRole: { __typename?: 'Role'; name: string };
      };
    }> | null;
    pageInfo: {
      __typename?: 'PageInfo';
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage?: boolean | null;
      hasPreviousPage?: boolean | null;
    };
  };
};

export type LogInMutationVariables = Exact<{
  data: LogInInput;
}>;

export type LogInMutation = {
  __typename?: 'Mutation';
  logIn: {
    __typename?: 'Auth';
    authenticatedUser: {
      __typename?: 'User';
      createdAt: any;
      displayedId: string;
      updatedAt: any;
      userCredential: { __typename?: 'UserCredential'; email: string };
      userRole: { __typename?: 'Role'; name: string; displayedId: string };
    };
  };
};

export const GetUserConnectionDocument = `
    query GetUserConnection($sort: UserSortInput, $pagination: PaginationInput) {
  getUserConnection(sort: $sort, pagination: $pagination) {
    edges {
      node {
        displayedId
        userCredential {
          email
        }
        userRole {
          name
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
    `;
export const useGetUserConnectionQuery = <TData = GetUserConnectionQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: GetUserConnectionQueryVariables,
  options?: UseQueryOptions<GetUserConnectionQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<GetUserConnectionQuery, TError, TData>(
    variables === undefined ? ['GetUserConnection'] : ['GetUserConnection', variables],
    fetcher<GetUserConnectionQuery, GetUserConnectionQueryVariables>(
      client,
      GetUserConnectionDocument,
      variables,
      headers,
    ),
    options,
  );
export const LogInDocument = `
    mutation LogIn($data: LogInInput!) {
  logIn(data: $data) {
    authenticatedUser {
      createdAt
      displayedId
      updatedAt
      userCredential {
        email
      }
      userRole {
        name
        displayedId
      }
    }
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
