import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { UserWithRolesAndCredential } from '../prisma/custom-types';

@Injectable()
export class SessionService {
  /**
   * セッションに保存したユーザーデータを更新
   * @param req リクエストオブジェクト (セッションデータ更新用)
   * @param userWithRolesAndCredential セッションのユーザーデータを更新する元オブジェクト
   */
  updateUserSession(req: Request, userWithRolesAndCredential: UserWithRolesAndCredential): void {
    /**
     * MEMO
     * req.logIn()は内部的にlocal.serializer.tsのserializeUser()を呼ぶ。
     * req.logIn()の第一引数はserializeUser()の第一引数に渡されるため型を同一にする必要あり。
     */
    req.logIn(userWithRolesAndCredential, (err) => {
      if (err instanceof Error) {
        this.deleteUserSesion(req);
        Logger.error(`updateUserSession: Session Update Error, ${err.message}`);

        throw new InternalServerErrorException();
      }
    });
  }

  /**
   * ユーザーのセッションデータを完全に削除
   * req.logOutの呼び出しではpassport(ユーザーデータ)のデータのみ削除
   * req.session.destroyを呼ばないとセッションにcookie情報が記載されたデータが残る
   * @param req リクエストオブジェクト (セッションデータ削除用)
   */
  deleteUserSesion(req: Request): void {
    // passport(ユーザーデータ)のデータ削除
    req.logOut((err) => {
      if (err instanceof Error) {
        Logger.error(`deleteUserSesion: req.logOut Error, ${err.message}`);

        throw new HttpException('Log Out Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    // cookie情報と結びついたセッションデータ削除
    req.session.destroy((err) => {
      if (err instanceof Error) {
        Logger.error(`deleteUserSesion: req.sesion.destroy Error, ${err.message}`);

        throw new HttpException('Session Destroy Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  }
}
