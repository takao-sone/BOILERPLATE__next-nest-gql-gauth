import { GraphQLClient } from 'graphql-request';
import { FC } from 'react';
import { usePrismaTestQuery, useSampleArgsQuery } from '../generated/graphql';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_DEV_GRAPHQL_ENDPOINT!;

type Props = {};

const Sample: FC<Props> = () => {
  let graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {});
  const { data } = usePrismaTestQuery(graphQLClient, {});
  graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {});
  const { isLoading, data: data2 } = useSampleArgsQuery(graphQLClient, { name: 'FooBar' });

  return (
    <div>
      <span>sone</span>
      {isLoading && <div>Loading...</div>}
      {data && <div>{JSON.stringify(data)}</div>}
      <br />
      {data2 && <div>{JSON.stringify(data2)}</div>}
    </div>
  );
};

export default Sample;
