import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as createRedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
import { AppModule } from './app.module';
import { EnvService } from './modules/app-config/env.service';
import { PrismaService } from './modules/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  // Prisma
  // PrismaがNestJSのshutdown hooksが発火される前にprocess.exit()を呼び出すのでPrismaのbeforeExitイベントのリスナーを設定
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Redis
  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    host: envService.getRedisHost(),
    port: envService.getRedisPort(),
  });

  // Session
  app.use(
    session({
      name: envService.getSessionName(),
      store: new RedisStore({ client: redisClient, logErrors: true }),
      secret: envService.getSessionSecret(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: envService.getSessionMaxAge(),
        httpOnly: true,
        secure: envService.isProduction(),
        sameSite: envService.isProduction() ? 'lax' : 'none',
      },
    }),
  );

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(envService.getAppPort(), envService.getAppHost());

  Logger.log(`===== Running on ${envService.getAppHost()}:${envService.getAppPort()} =====`);
}

void bootstrap();
