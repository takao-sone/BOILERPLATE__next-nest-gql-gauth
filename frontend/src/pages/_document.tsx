import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { FC } from 'react';

const Document: FC = () => {
  return (
    <Html>
      <Head />
      <body>
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
