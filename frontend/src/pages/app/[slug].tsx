import { SEO } from 'components/common/SEO';
import { AppLayout } from 'components/layout/AppLayout';
import { ReactElement } from 'react';
import { getAllMetaPostIds, getMetaPostData, MetaPostStaticProps } from 'utils/pageHelper';
import { NextPageWithLayout } from '../_app';

type Props = {} & {
  metaPostData: Awaited<ReturnType<typeof getMetaPostData>>;
};

const AppMetaPostPage: NextPageWithLayout<Props> = ({ metaPostData }) => {
  const { title, description } = metaPostData;

  return (
    <>
      <SEO pageTitle={title} pageDescription={description} />
      <div dangerouslySetInnerHTML={{ __html: metaPostData.contentHtml }} />
    </>
  );
};

export async function getStaticPaths() {
  const paths = getAllMetaPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: MetaPostStaticProps) {
  const metaPostData = await getMetaPostData(params.slug);
  return {
    props: {
      metaPostData,
    },
  };
}

AppMetaPostPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default AppMetaPostPage;
