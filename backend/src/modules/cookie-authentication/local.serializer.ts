import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserWithRolesAndCredential } from '../prisma/custom-types';
import { SessionUser } from './dtos/session-user.dto';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: UserWithRolesAndCredential, done: CallableFunction) {
    // MEMO: 現時点でユーザーが結びつくロールは1つのみ
    const userRole = user.userRoles[0];

    if (!userRole) {
      Logger.error('serializeUser: userRole is undefined.');
      throw new Error('Internal Server Error');
    }

    const sessionUser: SessionUser = {
      id: user.id,
      displayedId: user.displayedId,
      userCredential: { email: user.userCredential.email },
      userRole: { displayedId: userRole.role.displayedId, name: userRole.role.name },
    };

    done(null, sessionUser);
  }

  deserializeUser(payload: SessionUser, done: CallableFunction) {
    done(null, payload);
  }
}
