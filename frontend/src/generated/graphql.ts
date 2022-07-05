import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, UseQueryOptions } from 'react-query';
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
  confirmationPassword: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  roleDisplayedId: Scalars['String'];
};

export type LogInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  logIn: Auth;
  logOut: Scalars['String'];
  updateUserEmail: User;
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
  getAuthenticatedUser: Auth;
  getUsers: Array<User>;
  prismaTest: Array<Sample>;
  sample: Sample;
  sampleArgs: Array<Sample>;
  samplesInput: Array<Sample>;
};

export type QuerySampleArgsArgs = {
  name: Scalars['String'];
};

export type QuerySamplesInputArgs = {
  data: SamplesInput;
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

/** サンプル用GraphQLモデル */
export type Sample = {
  __typename?: 'Sample';
  /** データ作成時間 */
  createdAt: Scalars['DateTime'];
  /** クライアントアプリケーション側へ表示しても良いID */
  displayedId: Scalars['ID'];
  /** 名前 */
  name: Scalars['String'];
  /** データ更新時間 */
  updatedAt: Scalars['DateTime'];
};

export type SamplesInput = {
  name: Scalars['String'];
};

export type UpdateUserEmailInput = {
  newEmail: Scalars['String'];
};

export type UpdateUserRoleInput = {
  newRoleDisplayedId: Scalars['String'];
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
  /** ユーザー認証情報 */
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

export type PrismaTestQueryVariables = Exact<{ [key: string]: never }>;

export type PrismaTestQuery = {
  __typename?: 'Query';
  prismaTest: Array<{
    __typename?: 'Sample';
    displayedId: string;
    name: string;
    createdAt: any;
    updatedAt: any;
  }>;
};

export type SampleArgsQueryVariables = Exact<{
  name: Scalars['String'];
}>;

export type SampleArgsQuery = {
  __typename?: 'Query';
  sampleArgs: Array<{
    __typename?: 'Sample';
    displayedId: string;
    name: string;
    createdAt: any;
    updatedAt: any;
  }>;
};

export const PrismaTestDocument = `
    query PrismaTest {
  prismaTest {
    displayedId
    name
    createdAt
    updatedAt
  }
}
    `;
export const usePrismaTestQuery = <TData = PrismaTestQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: PrismaTestQueryVariables,
  options?: UseQueryOptions<PrismaTestQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<PrismaTestQuery, TError, TData>(
    variables === undefined ? ['PrismaTest'] : ['PrismaTest', variables],
    fetcher<PrismaTestQuery, PrismaTestQueryVariables>(
      client,
      PrismaTestDocument,
      variables,
      headers,
    ),
    options,
  );
export const SampleArgsDocument = `
    query SampleArgs($name: String!) {
  sampleArgs(name: $name) {
    displayedId
    name
    createdAt
    updatedAt
  }
}
    `;
export const useSampleArgsQuery = <TData = SampleArgsQuery, TError = unknown>(
  client: GraphQLClient,
  variables: SampleArgsQueryVariables,
  options?: UseQueryOptions<SampleArgsQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<SampleArgsQuery, TError, TData>(
    ['SampleArgs', variables],
    fetcher<SampleArgsQuery, SampleArgsQueryVariables>(
      client,
      SampleArgsDocument,
      variables,
      headers,
    ),
    options,
  );
