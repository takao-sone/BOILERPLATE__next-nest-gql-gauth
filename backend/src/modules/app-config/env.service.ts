import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env, EnvType } from './env.validator';

interface EnvVariables {
  NODE_ENV: EnvType;
  APP_ENV: EnvType;
  // APP
  APP_HOST: string;
  APP_PORT: number;
  APP_FRONTEND_PORT: number;
  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  SESSION_SECRET: string;
  SESSION_NAME: string;
  SESSION_MAX_AGE: number;
  // Prisma
  DATABASE_URL: string;
}

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvVariables, true>) {}

  getNodeEnv() {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  getAppEnv() {
    return this.configService.get('APP_ENV', { infer: true });
  }

  getAppHost() {
    return this.configService.get('APP_HOST', { infer: true });
  }

  getAppPort() {
    return this.configService.get('APP_PORT', { infer: true });
  }

  getAppFrontendPort() {
    return this.configService.get('APP_FRONTEND_PORT', { infer: true });
  }

  getRedisHost() {
    return this.configService.get('REDIS_HOST', { infer: true });
  }

  getRedisPort() {
    return this.configService.get('REDIS_PORT', { infer: true });
  }

  getSessionSecret() {
    return this.configService.get('SESSION_SECRET', { infer: true });
  }

  getSessionName() {
    return this.configService.get('SESSION_NAME', { infer: true });
  }

  getSessionMaxAge() {
    return this.configService.get('SESSION_MAX_AGE', { infer: true });
  }

  isProduction() {
    return this.getAppEnv() === Env.Production;
  }

  isStaging() {
    return this.getAppEnv() === Env.Staging;
  }

  isDevelopment() {
    return this.getAppEnv() === Env.Development;
  }

  isTest() {
    return this.getAppEnv() === Env.Test;
  }
}
