import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './modules/app-config/env.service';
import { PrismaService } from './modules/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  // PrismaがNestJSのshutdown hooksが発火される前にprocess.exit()を呼び出すのでPrismaのbeforeExitイベントのリスナーを設定
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(envService.getPort(), envService.getHost());

  Logger.log(`===== Running on ${envService.getHost()}:${envService.getPort()} =====`);
}

void bootstrap();
