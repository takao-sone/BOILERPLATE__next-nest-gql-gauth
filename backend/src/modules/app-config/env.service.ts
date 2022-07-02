import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env, EnvType } from './env.validator';

interface EnvVariables {
  NODE_ENV: EnvType;
  APP_ENV: EnvType;
  // APP
  APP_HOST: string;
  APP_PORT: number;
  // Prisma
  DATABASE_URL: string;
}

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<EnvVariables, true>) {}

  getNodeEnv() {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  getAppEnv(): string {
    return this.configService.get<string>('APP_ENV', { infer: true });
  }

  getHost(): string {
    return this.configService.get<string>('APP_HOST', { infer: true });
  }

  getPort(): number {
    return this.configService.get<number>('APP_PORT', { infer: true });
  }

  isProduction(): boolean {
    return this.getAppEnv() === Env.Production;
  }

  isStaging(): boolean {
    return this.getAppEnv() === Env.Staging;
  }

  isDevelopment(): boolean {
    return this.getAppEnv() === Env.Development;
  }
}
