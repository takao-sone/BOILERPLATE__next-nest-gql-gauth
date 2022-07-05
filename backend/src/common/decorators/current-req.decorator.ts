import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';

export const CurrentReq = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(context);

  return gqlCtx.getContext<ExpressContext>().req;
});
