import { CircularProgress } from '@mui/material';
import { FC } from 'react';
import { APIError } from '../components/common/AppErrorBoundary';
import { usePrismaTest, useSampleArgs } from '../fetchers';

type Props = {};

// TODO: サンプルページなので本実装時に消す
const ReactQuerySample: FC<Props> = () => {
  // MEMO: GraphQLリクエスト例
  const {
    isLoading: isLoadingPrismaTest,
    data: dataPrismaTest,
    error: errorPrismaTest,
  } = usePrismaTest();
  const {
    isLoading: isLoadingSampleArgs,
    data: dataSampleArgs,
    error: errorSampleArgs,
  } = useSampleArgs({ name: 'Boilerplate' });

  if (isLoadingPrismaTest || isLoadingSampleArgs)
    return (
      <div>
        <CircularProgress color="inherit" />
      </div>
    );
  if (errorPrismaTest || errorSampleArgs) throw errorPrismaTest;
  if (!dataPrismaTest || !dataSampleArgs) throw new APIError(404);

  return (
    <div>
      <h1>ReactQuerySample</h1>
      <section>
        <h2>PrismaTest</h2>
        <div>{JSON.stringify(dataPrismaTest)}</div>
      </section>
      <section>
        <h2>SampleArgs</h2>
        <div>{JSON.stringify(dataSampleArgs)}</div>
      </section>
    </div>
  );
};

export default ReactQuerySample;
