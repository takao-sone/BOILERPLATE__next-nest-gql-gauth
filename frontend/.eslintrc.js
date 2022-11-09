module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/warnings',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    '@next/next/no-img-element': 'off',
  },
  overrides: [],
};
