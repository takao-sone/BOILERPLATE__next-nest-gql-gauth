import { CircularProgress } from '@mui/material';
import AppDialog from 'components/common/AppDialog';
import { Test } from 'components/common/Test';
import type { NextPage } from 'next';
import { Suspense } from 'react';
import { useRecoilCallback } from 'recoil';
import GoogleIdentity, { GI_BUTTON_TYPE } from '../components/common/GoogleIdentity';
import SEO from '../components/common/SEO';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <SEO pageTitle={`Create Next App`} pageDescription={`Generated by create next app`}>
        <link rel="icon" href="/favicon.ico" />
      </SEO>

      <main className={styles.main}>
        <Suspense fallback={<CircularProgress />}>
          <Test />
        </Suspense>
        <GoogleIdentity buttonType={GI_BUTTON_TYPE.LOGIN} />
        {/* <GoogleIdentity buttonType={GI_BUTTON_TYPE.REGISTER} /> */}
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <AppDialog />
        {process.env.NODE_ENV === 'development' && <DebugButton />}
      </main>
    </div>
  );
};

function DebugButton() {
  const onClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        console.debug('Atom values:');
        // @ts-ignore
        for (const node of snapshot.getNodes_UNSTABLE()) {
          const value = await snapshot.getPromise(node);
          console.log(node.key, value);
        }
      },
    [],
  );

  return <button onClick={onClick}>Dump State</button>;
}

export default Home;
