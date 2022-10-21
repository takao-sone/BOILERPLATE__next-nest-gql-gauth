import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

const Document = () => {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      </body>
    </Html>
  );
};

export default Document;
