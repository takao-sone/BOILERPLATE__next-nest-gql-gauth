import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(client: GraphQLClient, query: string, variables?: TVariables, headers?: RequestInit['headers']) {
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

export type GoogleRegisterInput = {
  /** フロントエンドのリクエストで発行されたGoogleのcredential（JWT） */
  credential: Scalars['String'];
};

export type GoogleTokenAuth = {
  __typename?: 'GoogleTokenAuth';
  /** アクセストークン */
  accessToken: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
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
   *       ページネーションによりユーザーを取得するオペレーション
   *
   *
   */
  userConnection: UserConnection;
};


export type QueryroleConnectionArgs = {
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<RoleSortInput>;
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
  ID: 'ID'
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
  DESC: 'DESC'
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

export type UserContactDetail = {
  __typename?: 'UserContactDetail';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** メールアドレス */
  email: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
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
  ID: 'ID'
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

export type GoogleRegisterUserMutationVariables = Exact<{
  data: GoogleRegisterInput;
}>;


export type GoogleRegisterUserMutation = { __typename?: 'Mutation', googleRegisterUser: { __typename?: 'GoogleTokenAuth', accessToken: string } };

export type LogInMutationVariables = Exact<{
  data: TokenLogInInput;
}>;


export type LogInMutation = { __typename?: 'Mutation', logIn: { __typename?: 'TokenAuth', accessToken: string, refreshToken: string } };

export type UserConnectionQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<UserSortInput>;
}>;


export type UserConnectionQuery = { __typename?: 'Query', userConnection: { __typename?: 'UserConnection', totalCount: number, edges?: Array<{ __typename?: 'UserEdge', cursor: string, node: { __typename?: 'User', displayedId: string, userCredential: { __typename?: 'UserCredential', email: string }, userRole: { __typename?: 'Role', name: string } } }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, startCursor?: string | null } } };


export const GoogleRegisterUserDocument = `
    mutation GoogleRegisterUser($data: GoogleRegisterInput!) {
  googleRegisterUser(data: $data) {
    accessToken
  }
}
    `;
export const useGoogleRegisterUserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<GoogleRegisterUserMutation, TError, GoogleRegisterUserMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<GoogleRegisterUserMutation, TError, GoogleRegisterUserMutationVariables, TContext>(
      ['GoogleRegisterUser'],
      (variables?: GoogleRegisterUserMutationVariables) => fetcher<GoogleRegisterUserMutation, GoogleRegisterUserMutationVariables>(client, GoogleRegisterUserDocument, variables, headers)(),
      options
    );
export const LogInDocument = `
    mutation LogIn($data: TokenLogInInput!) {
  logIn(data: $data) {
    accessToken
    refreshToken
  }
}
    `;
export const useLogInMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<LogInMutation, TError, LogInMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<LogInMutation, TError, LogInMutationVariables, TContext>(
      ['LogIn'],
      (variables?: LogInMutationVariables) => fetcher<LogInMutation, LogInMutationVariables>(client, LogInDocument, variables, headers)(),
      options
    );
export const UserConnectionDocument = `
    query UserConnection($pagination: PaginationInput, $sort: UserSortInput) {
  userConnection(pagination: $pagination, sort: $sort) {
    edges {
      cursor
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
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    totalCount
  }
}
    `;
export const useUserConnectionQuery = <
      TData = UserConnectionQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: UserConnectionQueryVariables,
      options?: UseQueryOptions<UserConnectionQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<UserConnectionQuery, TError, TData>(
      variables === undefined ? ['UserConnection'] : ['UserConnection', variables],
      fetcher<UserConnectionQuery, UserConnectionQueryVariables>(client, UserConnectionDocument, variables, headers),
      options
    );