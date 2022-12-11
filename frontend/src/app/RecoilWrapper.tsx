'use client';

import { FC, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

type Props = {
  children: ReactNode;
};

const RecoilWrapper: FC<Props> = ({ children }) => {
  return (
    <>
      <RecoilRoot>{children}</RecoilRoot>
    </>
  );
};

export default RecoilWrapper;
