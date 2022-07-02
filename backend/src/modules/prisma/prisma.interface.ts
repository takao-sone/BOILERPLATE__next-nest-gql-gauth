/**
 * MIT License
 *
 * Copyright (c) 2020 Marc Stammerjohann
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { ModuleMetadata, Type } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const PRISMA_SERVICE_OPTIONS = 'PRISMA_SERVICE_OPTIONS';
export const PRISMA_EXPLICIT_CONNECT = 'PRISMA_EXPLICIT_CONNECT';

export interface PrismaModuleOptions {
  /**
   * If "true", registers `PrismaModule` as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal: boolean;

  prismaServiceOptions?: PrismaServiceOptions;
}

export interface PrismaServiceOptions {
  /**
   * Pass options directly to the `PrismaClient`.
   * See: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference/#prismaclient
   */
  prismaOptions?: Prisma.PrismaClientOptions;

  /**
   * If "true", `PrismaClient` explicitly creates a connection pool and your first query will respond instantly.
   *
   * For most use cases the lazy connect behavior of `PrismaClient` will do. The first query of `PrismaClient` creates the connection pool.
   * See: https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management
   */
  explicitConnect?: boolean;

  /**
   * Apply Prisma middlewares to perform actions before or after db queries.
   *
   * See: https://www.prisma.io/docs/concepts/components/prisma-client/middleware
   */
  middlewares?: Array<Prisma.Middleware>;
}

export interface PrismaOptionsFactory {
  createPrismaOptions(): Promise<PrismaServiceOptions> | PrismaServiceOptions;
}

export interface PrismaModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal: boolean;
  useExisting?: Type<PrismaOptionsFactory>;
  useClass?: Type<PrismaOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<PrismaServiceOptions> | PrismaServiceOptions;
  inject?: any[];
}
