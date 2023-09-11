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
      includeStacktraceInErrorResponses: true,
      playground: true,
    };

    // For Staging
    if (this.envService.isStaging()) {
      apolloDriverConfig = {
        autoSchemaFile: true,
        sortSchema: true,
        includeStacktraceInErrorResponses: true,
        playground: false,
      };
    }

    // For Production
    if (this.envService.isProduction()) {
      apolloDriverConfig = {
        autoSchemaFile: true,
        sortSchema: true,
        includeStacktraceInErrorResponses: true,
        playground: false,
      };
    }

    return apolloDriverConfig;
  }
}
