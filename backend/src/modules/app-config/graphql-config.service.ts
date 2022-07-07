import * as path from 'path';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { EnvService } from './env.service';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
  constructor(private readonly envService: EnvService) {}

  createGqlOptions(): ApolloDriverConfig {
    let apolloDriverConfig: ApolloDriverConfig;

    // For Local Development
    apolloDriverConfig = {
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      debug: true,
      playground: true,
      // CORS
      cors: {
        origin: [
          `http://localhost:${this.envService.getAppFrontendPort()}`,
          // Apollo StudioでCookieを用いるためのCORS設定
          'https://studio.apollographql.com',
        ],
        credentials: true,
      },
    };

    // For Staging
    if (this.envService.isStaging()) {
      apolloDriverConfig = {
        autoSchemaFile: true,
        sortSchema: true,
        debug: false,
        playground: false,
      };
    }

    // For Production
    if (this.envService.isProduction()) {
      apolloDriverConfig = {
        autoSchemaFile: true,
        sortSchema: true,
        debug: false,
        playground: false,
      };
    }

    return apolloDriverConfig;
  }
}
