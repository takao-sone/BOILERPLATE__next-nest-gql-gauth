import {
  useAuthenticatedUserQuery,
  useGoogleLoginMutation,
  useGoogleLogoutMutation,
  useGoogleRegisterUserMutation,
  useLogInMutation,
  useTestQuery,
} from 'generated/graphql';
import { useAuthAccessTokenValue } from 'global-states/auth-access-token.state';
import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';

const BASE_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!;

const BASE_GRAPHQL_CLIENT_OPTIONS: RequestInit = { credentials: 'include' };

export const useLogIn = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);
  return useLogInMutation(graphqlClient);
};

export const useGoogleRegisterUser = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);
  const { mutateAsync } = useGoogleRegisterUserMutation(graphqlClient);
  return { mutateAsync };
};

export const useGoogleLogin = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);
  const { mutateAsync } = useGoogleLoginMutation(graphqlClient);
  return { mutateAsync };
};

export const getAuthenticatedUser = (authAccessToken: string) => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${authAccessToken}`,
  };
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, { headers });
  return useAuthenticatedUserQuery.fetcher(graphqlClient)();
};

export const useGoogleLogout = () => {
  const authAccessToken = useAuthAccessTokenValue();
  const headers: HeadersInit = {
    Authorization: `Bearer ${authAccessToken}`,
  };
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, { headers });
  return useGoogleLogoutMutation(graphqlClient);
};

export const useTest = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT);
  return useTestQuery(graphqlClient);
};
