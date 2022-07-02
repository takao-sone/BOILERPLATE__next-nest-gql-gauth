## STEPS

### Base

```shell
yarn create next-app --typescript

cd {project-name}

touch .n-node-version
```

### `src` directory

```shell
# check if you are in root
pwd

mkdir src

mv pages src
mv styles src
```

tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    ...
  },
  ...
}
```

package.json
```json
{
  ...
  "scripts": {
    ...
    "lint": "next lint --dir src"
    ...
  },
  ...
}
```

### ESLint, Prettier

```shell
n exec auto yarn add --dev eslint-config-prettier prettier

mv .eslintrc.json .eslintrc.js

touch .prettierrc

touch .env
```

package.json
```json
{
  ...
  "scripts": {
    ...
    "lint": "next lint --dir src",
    "lint:fix": "eslint src --ext .js,jsx,.ts,.tsx --fix",
    "format": "prettier --write --ignore-path .gitignore './**/*.{js,jsx,ts,tsx,json,css}'"
    ...
  },
  ...
}
```

.eslintrc.js
```javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/warnings',
  ],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
  overrides: [],
};
```

.prettierrc
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

.env
```dotenv
NEXT_PUBLIC_APP_ENV=development
```

### MUI

```shell
n exec auto yarn add @mui/material @emotion/react @emotion/styled @mui/icons-material

mkdir src/providers
touch src/providers/Mui.provider.tsx
touch src/styles/mui-theme.ts
```

Mui.provider.tsx と mui-theme.ts を編集

### React Query

```shell
n exec auto yarn add react-query

touch src/providers/ReactQuery.provider.tsx
mkdir src/utils
touch src/utils/env.ts
```

ReactQuery.provider.tsx と env.ts を編集

### ErrorBoundary Class

```shell
mkdir src/components
mkdir src/components/common
touch src/components/common/AppErrorBoundary.tsx
```

AppErrorBoundary.tsx を編集

### SEO

```shell
touch src/components/common/SEO.tsx
```

SEO.tsx を編集

### lefthook

```shell
n exec auto yarn add -D @arkweid/lefthook
```

lefthook.yml を編集
