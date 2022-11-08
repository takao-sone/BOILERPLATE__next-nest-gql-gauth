import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { UseQueryOptions } from 'react-query';
import {
  AuthenticatedUserQuery,
  useAuthenticatedUserQuery,
  useGoogleLoginMutation,
  useGoogleRegisterUserMutation,
  useLogInMutation,
} from 'generated/graphql';
import { useAuthAccessTokenValue } from 'global-states/auth-state';

const BASE_GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_APP_ENV === 'development'
    ? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!
    : process.env.NEXT_PUBLIC_PROD_GRAPHQL_ENDPOINT!;

const BASE_GRAPHQL_CLIENT_OPTIONS: RequestInit = { credentials: 'include' };

// export const useUserConnection = (variables?: UserConnectionQueryVariables) => {
//   const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);

//   return useUserConnectionQuery(graphqlClient, variables);
// };

export const useLogIn = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);

  return useLogInMutation(graphqlClient);
};

// TODO
export const useGoogleRegisterUser = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);

  const { mutateAsync } = useGoogleRegisterUserMutation(graphqlClient);

  return { mutateAsync };
};

// TODO
export const useGoogleLogin = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);

  const { mutateAsync } = useGoogleLoginMutation(graphqlClient);

  return { mutateAsync };
};

export const useAuthenticatedUser = () => {
  // const authAccessToken = useRecoilValue(authAccessTokenState);
  const authAccessToken = useAuthAccessTokenValue();
  const headers: HeadersInit = {
    Authorization: `Bearer ${authAccessToken}`,
  };
  const options: UseQueryOptions<AuthenticatedUserQuery, unknown, AuthenticatedUserQuery> = {
    enabled: !!authAccessToken,
    retry: false,
  };

  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, { headers });
  return useAuthenticatedUserQuery(graphqlClient, undefined, options, headers);
};

export const getAuthenticatedUser = (authAccessToken: string) => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${authAccessToken}`,
  };

  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, { headers });
  return useAuthenticatedUserQuery.fetcher(graphqlClient)();
};
