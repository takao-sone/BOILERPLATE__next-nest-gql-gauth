import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
} from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import { EnvService } from './env.service';

@Plugin()
export class ApolloLoggingPlugin implements ApolloServerPlugin {
  constructor(private readonly envService: EnvService) {}

  async requestDidStart(requestContext: GraphQLRequestContext<BaseContext>) {
    // Production / Staging ではログ出力なし
    if (!this.envService.isDevelopment()) return;

    const {
      request: { query, operationName, variables },
    } = requestContext;

    // operationNameが IntrospectionQuery の場合はログ出力なし
    if (operationName === 'IntrospectionQuery') return;

    Logger.log('===== Request started =====');

    return {
      async didEncounterErrors({ errors }: GraphQLRequestContextDidEncounterErrors<BaseContext>) {
        const message = { errors };
        Logger.error(message);
      },
      async willSendResponse() {
        const message = {
          operationName,
          query,
          variables,
        };
        Logger.log(message);
      },
    };
  }
}
