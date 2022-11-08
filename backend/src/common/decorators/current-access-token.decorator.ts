import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { ExtractJwt } from 'passport-jwt';

export const CurrentAccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext<ExpressContext>();
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!accessToken) {
      Logger.error('No AccessToken');
      throw new BadRequestException('No AccessToken');
    }
    return accessToken;
  },
);
