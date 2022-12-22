import { useRecoilCallback } from 'recoil';

const RecoilStateDebugButton = () => {
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
};

export default RecoilStateDebugButton;
