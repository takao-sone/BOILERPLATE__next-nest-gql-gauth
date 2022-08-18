import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleName } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import { SessionUser } from './dtos/session-user';
import { LoggedInGuard } from './logged-in.guard';

export const RoleGuard = (...roleNames: RoleName[]): Type<CanActivate> => {
  class RoleGuardMixin extends LoggedInGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const gqlCtx = GqlExecutionContext.create(context);
      const gqlReq = gqlCtx.getContext<ExpressContext>().req;
      // TODO: Passport.jsによって設定され型補完方法が不明なため型アサーション(as)で対応
      const user = gqlReq.user as SessionUser | undefined;

      if (!user) {
        return false;
      }

      return roleNames.some((roleName) => user.roleNames.includes(roleName));
    }
  }

  return mixin(RoleGuardMixin);
};