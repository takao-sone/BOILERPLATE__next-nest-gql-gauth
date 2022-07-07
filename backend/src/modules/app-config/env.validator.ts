import { plainToClass } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

export const Env = {
  Production: 'production',
  Staging: 'staging',
  Development: 'development',
  Test: 'test',
} as const;

const envTypes = Object.values(Env);
export type EnvType = typeof envTypes[number];

export class EnvValidator {
  @IsIn(envTypes)
  NODE_ENV!: EnvType;

  @IsIn(envTypes)
  APP_ENV!: EnvType;

  @IsNotEmpty()
  @IsString()
  APP_HOST!: string;

  @IsNotEmpty()
  @IsNumber()
  APP_PORT!: number;

  @IsNotEmpty()
  @IsNumber()
  APP_FRONTEND_PORT!: number;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST!: string;

  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT!: number;

  @IsNotEmpty()
  @IsString()
  SESSION_SECRET!: string;

  @IsNotEmpty()
  @IsString()
  SESSION_NAME!: string;

  @IsNotEmpty()
  @IsNumber()
  SESSION_MAX_AGE!: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL!: string;
}

export const customValidate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvValidator, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
