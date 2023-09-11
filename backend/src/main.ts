import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { EnvService } from './modules/app-config/env.service';

/**
 * 本番用bootstrap関数
 */
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const envService = app.get(EnvService);

// // Prisma
// // https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-5#removal-of-the-beforeexit-hook-from-the-library-engine
// app.enableShutdownHooks();

//   // Redis
//   const RedisStore = createRedisStore(session);
//   const redisClient = createClient({
//     host: envService.getRedisHost(),
//     port: envService.getRedisPort(),
//   });

//   // Session
//   app.use(
//     session({
//       name: envService.getSessionName(),
//       store: new RedisStore({ client: redisClient, logErrors: true }),
//       secret: envService.getSessionSecret(),
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//         maxAge: envService.getSessionMaxAge(),
//         httpOnly: true,
//         secure: envService.isProduction(),
//         sameSite: envService.isProduction() ? 'lax' : 'none',
//       },
//     }),
//   );

//   // Passport
//   app.use(passport.initialize());
//   app.use(passport.session());

//   // Validation
//   app.useGlobalPipes(new ValidationPipe());

//   await app.listen(envService.getAppPort(), envService.getAppHost());

//   Logger.log(`===== Running on ${envService.getAppHost()}:${envService.getAppPort()} =====`);
// }

// void bootstrap();

// ==============================================================================================
// ==============================================================================================
// ==============================================================================================

// /**
//  * 開発用bootstrap関数（Cookie認証）
//  * Apollo Studioでcookieを使用できるようにHTTP & HTTPSの2つのサーバーを起動
//  * 以下のimport文が必要
//  */
// // import * as fs from 'fs';
// // import * as http from 'http';
// // import * as https from 'https';
// // import { ExpressAdapter } from '@nestjs/platform-express';
// // import * as express from 'express';
// async function bootstrapForDev() {
//   const server = express();
//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

//   const envService = app.get(EnvService);

// // Prisma
// // https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-5#removal-of-the-beforeexit-hook-from-the-library-engine
// app.enableShutdownHooks();

//   // Redis
//   const RedisStore = createRedisStore(session);
//   const redisClient = createClient({
//     host: envService.getRedisHost(),
//     port: envService.getRedisPort(),
//   });

//   // MEMO: cookieで認証する場合は以下をコメントイン
//   // Session
//   app.use(
//     session({
//       name: envService.getSessionName(),
//       store: new RedisStore({ client: redisClient, logErrors: true }),
//       secret: envService.getSessionSecret(),
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//         maxAge: envService.getSessionMaxAge(),
//         httpOnly: true,
//         // secure: envService.isProduction(),
//         secure: true,
//         sameSite: envService.isProduction() ? 'lax' : 'none',
//       },
//     }),
//   );

//   // Passport
//   app.use(passport.initialize());
//   app.use(passport.session());

//   // Validation
//   app.useGlobalPipes(new ValidationPipe());

//   // Run both HTTP & HTTPS servers
//   await app.init();
//   http.createServer(server).listen(envService.getAppPort());
//   if (envService.isDevelopment()) {
//     const certDirectoryPath = `${process.cwd()}/mkcert`;
//     const httpsOptions = {
//       key: fs.readFileSync(`${certDirectoryPath}/localhost-key.pem`),
//       cert: fs.readFileSync(`${certDirectoryPath}/localhost.pem`),
//     };
//     https.createServer(httpsOptions, server).listen(443);
//   }

//   Logger.log(`===== Running on ${envService.getAppHost()}:${envService.getAppPort()} =====`);
// }

// void bootstrapForDev();

// ==============================================================================================
// ==============================================================================================
// ==============================================================================================

/**
 * 開発用bootstrap関数（Token認証）
 * Apollo Studioでcookieを使用できるようにHTTP & HTTPSの2つのサーバーを起動
 * 以下のimport文が必要
 */
async function bootstrapForDev() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const envService = app.get(EnvService);

  // CORS
  app.enableCors({
    origin: [envService.getAppFrontendOrigin(), 'https://studio.apollographql.com'],
  });

  // Prisma
  // https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-5#removal-of-the-beforeexit-hook-from-the-library-engine
  app.enableShutdownHooks();

  // Passport
  app.use(passport.initialize());

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(envService.getAppPort(), envService.getAppHost());

  Logger.log(`===== Running on ${envService.getAppHost()}:${envService.getAppPort()} =====`);
}

void bootstrapForDev();
