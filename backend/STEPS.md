## STEPS

### Base

```shell
nest new {project-name}

cd {project-name}

touch .n-node-version
```

### ESLint, Prettier

```shell
n exec auto yarn add -D eslint-plugin-import

touch .prettierignore
```

.prettierignore
```ignore
/test/**
*.spec.ts
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

.eslintrc.js
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/warnings',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
};
```

### lefthook

```shell
n exec auto yarn add -D @arkweid/lefthook
```

lefthook.yml を編集

### Config

```shell
n exec auto yarn add @nestjs/config

n exec auto yarn nest g module modules/app-config

touch src/modules/app-config/env.service.ts
```

生成したファイルの編集

src/main.ts
```typescript
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './modules/app-config/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  await app.listen(envService.getPort(), envService.getHost());

  Logger.log(`===== Running on ${envService.getHost()}:${envService.getPort()} =====`);
}

void bootstrap();
```

### Apollo (GraphQL)

```shell
n exec auto yarn add @nestjs/graphql @nestjs/apollo graphql apollo-server-express

touch src/modules/app-config/graphql-config.service.ts
touch src/modules/app-config/apollo-logging.plugin.ts
```

生成したファイルの編集

```shell
mkdir src/common
mkdir src/common/models
touch src/common/models/base.model.ts

n exec auto yarn nest g module modules/sample
mkdir src/modules/sample/dtos
mkdir src/modules/sample/models
touch src/modules/sample/dtos/samples-args.args.ts
touch src/modules/sample/dtos/samples-input.input.ts
touch src/modules/sample/models/sample.model.ts
touch src/modules/sample/sample.resolver.ts
```

生成したファイルの編集

### Prisma

```shell
n exec auto yarn add -D prisma     
n exec auto yarn add @prisma/client                   

# Check if Prisma is installed.
n exec auto yarn prisma
```

```shell
# Prisma Initialization
n exec auto yarn prisma init
```

schema.prisma の編集はVSCodeで。

schema.prisma
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

.env
```dotenv
DATABASE_URL="mysql://root:password@0.0.0.0:53306/example_db"
```

```shell
# Create a migration file & Do migration
n exec auto yarn prisma migrate dev --name init

# Generate Prisma Client
n exec auto yarn prisma generate
```

package.json
```json
{
  ...
  "scripts": {
    ...
    "start:dev": "prisma generate && nest start --watch",
    ...
  },
  ...
}
```

```shell
n exec auto yarn nest g module modules/prisma  
touch src/modules/prisma/prisma.interface.ts
touch src/modules/prisma/prisma.service.ts

touch src/modules/app-config/prisma-config.service.ts
```

```shell
n exec auto yarn start:dev
```

生成したファイルを編集

src/main.ts
```typescript
async function bootstrap() {
  ...

  // PrismaがNestJSのshutdown hooksが発火される前にprocess.exit()を呼び出すのでPrismaのbeforeExitイベントのリスナーを設定
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  ...
}
```

#### Seed Data

package.json
```json
{
  ...
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  ...
}
```

```shell
touch prisma/seed.ts
```

生成したファイルを編集

```shell
# Seed Data into DB
n exec auto yarn prisma db seed
```

### Validation

```shell
n exec auto yarn add class-validator class-transformer
```

src/main.ts
```typescript
async function bootstrap() {
  ...

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  ...
}
```
