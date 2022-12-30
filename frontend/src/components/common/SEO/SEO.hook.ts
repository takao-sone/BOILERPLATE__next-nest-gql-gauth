import { DEFAULT_APP_SITE_DESCRIPTION, DEFAULT_APP_SITE_TITLE } from './SEO.const';

export const useSiteTitle = (pageTitle?: string, defaultTitle: string = DEFAULT_APP_SITE_TITLE) => {
  return pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
};

export const useDescription = (description: string = DEFAULT_APP_SITE_DESCRIPTION) => {
  return description;
};
