import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from 'react-query';
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


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationLogInArgs = {
  data: LogInInput;
};


export type MutationUpdateUserEmailArgs = {
  data: UpdateUserEmailInput;
};


export type MutationUpdateUserRoleArgs = {
  data: UpdateUserRoleInput;
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
   *       すべてのユーザーを取得するオペレーション
   *
   *
   */
  getUsers: Array<User>;
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

export type UserCredential = {
  __typename?: 'UserCredential';
  /** DBへのデータ作成時間 */
  createdAt: Scalars['DateTime'];
  /** メールアドレス */
  email: Scalars['String'];
  /** DBへのデータ更新時間 */
  updatedAt: Scalars['DateTime'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', displayedId: string, userCredential: { __typename?: 'UserCredential', email: string }, userRole: { __typename?: 'Role', name: string, displayedId: string } }> };

export type LogInMutationVariables = Exact<{
  data: LogInInput;
}>;


export type LogInMutation = { __typename?: 'Mutation', logIn: { __typename?: 'Auth', authenticatedUser: { __typename?: 'User', createdAt: any, displayedId: string, updatedAt: any, userCredential: { __typename?: 'UserCredential', email: string }, userRole: { __typename?: 'Role', name: string, displayedId: string } } } };


export const GetUsersDocument = `
    query GetUsers {
  getUsers {
    displayedId
    userCredential {
      email
    }
    userRole {
      name
      displayedId
    }
  }
}
    `;
export const useGetUsersQuery = <
      TData = GetUsersQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetUsersQueryVariables,
      options?: UseQueryOptions<GetUsersQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetUsersQuery, TError, TData>(
      variables === undefined ? ['GetUsers'] : ['GetUsers', variables],
      fetcher<GetUsersQuery, GetUsersQueryVariables>(client, GetUsersDocument, variables, headers),
      options
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