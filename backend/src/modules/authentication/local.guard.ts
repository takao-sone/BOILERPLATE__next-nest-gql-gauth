import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ExpressContext } from 'apollo-server-express';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check email & password
    await super.canActivate(context);

    const gqlCtx = GqlExecutionContext.create(context);
    const gqlReq = gqlCtx.getContext<ExpressContext>().req;

    // Initialize session
    await super.logIn(gqlReq);

    // If no exceptions were thrown, allow the access to the route
    return true;
  }

  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const gqlReq = gqlCtx.getContext<ExpressContext>().req;

    if (gqlReq) {
      gqlReq.body = gqlCtx.getArgs().data;

      return gqlReq;
    }

    return context.switchToHttp().getRequest();
  }
}
