import { Injectable } from '@nestjs/common';
import { PrismaOptionsFactory, PrismaServiceOptions } from '../prisma/prisma.interface';
import { EnvService } from './env.service';

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  constructor(private readonly envService: EnvService) {}

  createPrismaOptions(): PrismaServiceOptions {
    let prismaServiceOptions: PrismaServiceOptions;

    // For Local Development
    prismaServiceOptions = {
      prismaOptions: {
        log: ['info', 'query', 'warn', 'error'],
      },
      explicitConnect: true,
    };

    // For Staging
    if (this.envService.isStaging()) {
      prismaServiceOptions = {
        prismaOptions: {
          log: ['warn', 'error'],
        },
        explicitConnect: true,
      };
    }

    // For Production
    if (this.envService.isProduction()) {
      prismaServiceOptions = {
        prismaOptions: {
          log: ['warn', 'error'],
        },
        explicitConnect: true,
      };
    }

    return prismaServiceOptions;
  }
}
