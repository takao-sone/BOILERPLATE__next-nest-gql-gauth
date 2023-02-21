import { useTest } from 'fetchers';
import Link from 'next/link';

export const Test = () => {
  console.log('---Test---');

  if (typeof window === 'undefined') {
    throw Error('Test component should only render on the client.');
  }

  const data = useTest();
  // const { data } = useQuery(['hoge1', 2], getCompanies);
  // const data = use(getCompanies());

  return (
    <div>
      <p>Test</p>
      <Link href="/sample">sample</Link>
      <div>{data.data?.test}</div>
    </div>
  );
};

Test.getInitialProps = async () => {
  return { props: {} };
};
