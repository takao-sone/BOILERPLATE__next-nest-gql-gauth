import { FC } from 'react';
import { useLogIn } from 'fetchers';

type Props = {};

const Sample: FC<Props> = () => {
  const foo = useLogIn({
    data: { email: '1@example.com', password: 'password' },
  });

  return (
    <div>
      <span>foo</span>
      <div>{JSON.stringify(foo)}</div>
    </div>
  );
};

export default Sample;
