module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/warnings',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    // TODO: '@tanstack/react-query'用
    'import/named': 'off',
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
      },
    ],
    '@next/next/no-img-element': 'off',
    // 'import/order': [
    //   'error',
    //   {
    //     alphabetize: {
    //       order: 'asc',
    //     },
    //   },
    // ],
  },
  overrides: [],
};
