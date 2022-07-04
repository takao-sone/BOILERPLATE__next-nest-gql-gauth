import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';

export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const gqlReq = gqlCtx.getContext<ExpressContext>().req;

    return gqlReq.isAuthenticated();
  }
}
