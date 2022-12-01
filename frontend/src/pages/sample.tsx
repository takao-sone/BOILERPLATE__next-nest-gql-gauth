import { Button } from '@mui/material';
import { useLogIn } from 'fetchers';
import { LogInMutationVariables } from 'generated/graphql';
import { useAuthUserValue } from 'global-states/auth-state';
import { FC, Suspense } from 'react';

type Props = {};

const Sample2: FC<Props> = () => {
  const variables: LogInMutationVariables = {
    data: { email: '1@example.com', password: 'password' },
  };

  const mutation = useLogIn();

  if (mutation.isLoading) {
    return <div>loading ...</div>;
  }

  if (mutation.isError) {
    throw mutation.error;
  }

  return (
    <div>
      <span>foo</span>
      <Button></Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          mutation.mutate(variables);
        }}
      >
        LogIn
      </Button>
      <div>{JSON.stringify(mutation.data)}</div>
    </div>
  );
};

const AuthUser: FC = () => {
  const authUser = useAuthUserValue();

  return (
    <div>
      {authUser ? (
        <div>
          <div>{authUser.displayedId}</div>
          <div>{authUser.userProfile.name}</div>
        </div>
      ) : (
        <div>
          <div>No Auth User</div>
        </div>
      )}
    </div>
  );
};

const Sample: FC = () => {
  return (
    <div>
      {/* <AppErrorBoundary>
        <Sample2 />
      </AppErrorBoundary> */}
      <Suspense>
        <AuthUser />
      </Suspense>
    </div>
  );
};

export default Sample;
