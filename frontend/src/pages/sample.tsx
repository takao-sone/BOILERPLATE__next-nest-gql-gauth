import { Button } from '@mui/material';
import AppErrorBoundary from 'components/common/AppErrorBoundary';
import { useLogIn } from 'fetchers';
import { LogInMutationVariables } from 'generated/graphql';
import Link from 'next/link';
import { FC } from 'react';

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
      <div>
        <Link href="/">Back</Link>
      </div>
      <div>{JSON.stringify(mutation.data)}</div>
    </div>
  );
};

const Sample: FC = () => {
  return (
    <div>
      <AppErrorBoundary>
        <Sample2 />
      </AppErrorBoundary>
    </div>
  );
};

export default Sample;
