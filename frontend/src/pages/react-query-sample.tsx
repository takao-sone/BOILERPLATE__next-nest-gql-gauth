import { CircularProgress } from '@mui/material';
import { FC } from 'react';
import { useGetUsers } from 'fetchers';

type Props = {};

// TODO: サンプルページなので本実装時に消す
const ReactQuerySample: FC<Props> = () => {
  // MEMO: GraphQLリクエスト例
  const { isLoading, data: getUsersData } = useGetUsers();

  if (isLoading)
    return (
      <div>
        <CircularProgress color="inherit" />
      </div>
    );

  return (
    <div>
      <h1>ReactQuerySample</h1>
      <section>
        <h2>GetUsers</h2>
        {!getUsersData ? (
          <div>no users</div>
        ) : (
          getUsersData.getUsers.map((user) => {
            return <div key={user.displayedId}>{JSON.stringify(user)}</div>;
          })
        )}
      </section>
    </div>
  );
};

export default ReactQuerySample;
