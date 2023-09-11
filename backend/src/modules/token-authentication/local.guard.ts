import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const gqlReq = gqlCtx.getContext().req;

    if (gqlReq) {
      gqlReq.body = gqlCtx.getArgs().data;

      return gqlReq;
    }

    return context.switchToHttp().getRequest();
  }
}
