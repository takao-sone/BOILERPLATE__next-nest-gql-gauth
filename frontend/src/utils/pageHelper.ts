import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

type MetaPostFrontMatter = {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
};

export type MetaPostStaticProps = {
  params: {
    slug: string;
  };
};

const metaPostsDirectory = 'markdown/meta';

export const getAllMetaPostIds = () => {
  const fileNames = fs.readdirSync(metaPostsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
};

export async function getMetaPostData(slug: string) {
  const fullPath = path.join(metaPostsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const contentHtml = await markdownToHtml(matterResult.content);
  const frontMatterData = matterResult.data as MetaPostFrontMatter;
  return {
    slug,
    contentHtml,
    ...frontMatterData,
  };
}

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
