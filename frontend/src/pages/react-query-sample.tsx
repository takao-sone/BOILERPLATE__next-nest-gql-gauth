import { CircularProgress } from '@mui/material';
import { useUserConnection } from 'fetchers';
import { SortDirection, UserConnectionQueryVariables, UserSortField } from 'generated/graphql';
import { FC } from 'react';

type Props = {};

// TODO: サンプルページなので本実装時に消す
const ReactQuerySample: FC<Props> = () => {
  // MEMO: GraphQLリクエスト例
  const getUserConnectionQueryVariables: UserConnectionQueryVariables = {
    pagination: {
      after: '3ee463b2-fbd7-11ec-a817-0242c0a8d002',
      first: 2,
      skip: 0,
    },
    sort: {
      direction: SortDirection.ASC,
      field: UserSortField.ID,
    },
  };
  const { isLoading, data } = useUserConnection(getUserConnectionQueryVariables);

  if (isLoading)
    return (
      <div>
        <CircularProgress color="inherit" />
      </div>
    );

  if (!data) return <div>data is undefined</div>;

  const {
    userConnection: { edges, pageInfo, totalCount },
  } = data;
  console.log(edges);

  return (
    <div>
      <h1>ReactQuerySample</h1>
      <section>
        <h2>GetUserConnection</h2>
        <h3>Users</h3>
        {!edges ? (
          <div>no users</div>
        ) : (
          edges?.map((user) => {
            return <div key={user.node.displayedId}>{JSON.stringify(user.node)}</div>;
          })
        )}
        <h3>pageInfo</h3>
        <div>{JSON.stringify(pageInfo)}</div>
        <h3>totalCount</h3>
        <div>{JSON.stringify(totalCount)}</div>
      </section>
    </div>
  );
};

export default ReactQuerySample;
