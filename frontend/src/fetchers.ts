import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import {
  useLogInMutation,
  UserConnectionQueryVariables,
  useUserConnectionQuery,
} from 'generated/graphql';

const BASE_GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_APP_ENV === 'development'
    ? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!
    : process.env.NEXT_PUBLIC_PROD_GRAPHQL_ENDPOINT!;

const BASE_GRAPHQL_CLIENT_OPTIONS: RequestInit = { credentials: 'include' };

export const useUserConnection = (variables?: UserConnectionQueryVariables) => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);

  return useUserConnectionQuery(graphqlClient, variables);
};

export const useLogIn = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);

  return useLogInMutation(graphqlClient);
};
