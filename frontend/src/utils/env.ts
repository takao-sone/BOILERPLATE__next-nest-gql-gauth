const ENVIRONMENTS = {
  development: 'development',
  staging: 'staging',
  production: 'production',
} as const;

export const isDevelopment = () => {
  return process.env.NEXT_PUBLIC_APP_ENV === ENVIRONMENTS.development;
};

export const isStaging = () => {
  return process.env.NEXT_PUBLIC_APP_ENV === ENVIRONMENTS.staging;
};

export const isProduction = () => {
  return process.env.NEXT_PUBLIC_APP_ENV === ENVIRONMENTS.production;
};
