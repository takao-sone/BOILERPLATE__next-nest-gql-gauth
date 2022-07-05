import Head from 'next/head';
import { FC } from 'react';

type Props = {
  isIndex?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  pagePath?: string;
  pageImg?: string;
  pageImgWidth?: number;
  pageImgHeight?: number;
};

const SEO: FC<Props> = ({
  isIndex = false,
  pageTitle,
  pageDescription,
  pagePath,
  pageImg,
  pageImgWidth,
  pageImgHeight,
  children,
}) => {
  const defaultTitle = 'example';
  const defaultDescription = 'example';

  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  const description = pageDescription ? pageDescription : defaultDescription;
  // TODO
  /* eslint-disable */
  const url = pagePath;
  const imgUrl = pageImg;
  const imgWidth = pageImgWidth ? pageImgWidth : 1280;
  const imgHeight = pageImgHeight ? pageImgHeight : 640;
  /* eslint-enable */

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/*Index*/}
      {!isIndex && <meta name="robots" content="noindex,nofollow" />}
      {/*OGP*/}
      <meta property="og:site_name" content="example" />
      <meta property="og:title" content="example" />
      <meta property="og:description" content="example" />
      <meta property="og:url" content="https://example.com" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ja" />
      <meta property="og:image" content="https://example.com/og_image.png" />
      <meta property="og:image:alt" content="example" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {/*twitter*/}
      <meta name="twitter:card" content="summary_large_image" />
      {/*Other*/}
      {children}
    </Head>
  );
};

export default SEO;
