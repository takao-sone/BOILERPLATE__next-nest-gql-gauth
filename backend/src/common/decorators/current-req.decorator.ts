import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentReq = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(context);

  return gqlCtx.getContext().req;
});
