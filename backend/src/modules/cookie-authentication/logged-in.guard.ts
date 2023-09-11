import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const gqlReq = gqlCtx.getContext().req;

    return gqlReq.isAuthenticated();
  }
}
