import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentResp = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(context);

  return gqlCtx.getContext().res;
});
