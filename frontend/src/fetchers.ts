import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { LogInMutationVariables, useGetUsersQuery, useLogInMutation } from 'generated/graphql';

const BASE_GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_APP_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_GRAPHQL_ENDPOINT!
    : process.env.NEXT_PUBLIC_PROD_GRAPHQL_ENDPOINT!;

const BASE_GRAPHQL_CLIENT_OPTIONS: RequestInit = { credentials: 'include' };

export const useGetUsers = () => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);

  return useGetUsersQuery(graphqlClient);
};

export const useLogIn = async (variables: LogInMutationVariables) => {
  const graphqlClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT, BASE_GRAPHQL_CLIENT_OPTIONS);

  const { mutateAsync } = useLogInMutation(graphqlClient, {
    useErrorBoundary: true,
  });

  try {
    return await mutateAsync(variables);
  } catch (err) {
    // onError処理
    throw err;
  } finally {
    // onSettled処理
  }
};
