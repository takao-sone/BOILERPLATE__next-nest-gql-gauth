import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { Request } from 'express';
import { UserWithRolesAndCredential } from '../prisma/custom-types';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthenticationService {
  constructor(private prismaService: PrismaService, private sessionService: SessionService) {}

  /**
   * ログアウト処理
   * セッションに保存したpassport(ユーザーデータ)のデータ削除と、cookieのデータを削除
   * @param req リクエストオブジェクト (セッションデータ削除用)
   */
  logOut(req: Request) {
    this.sessionService.deleteUserSesion(req);
  }

  /**
   * Pappport.jsのLocalStrategyのvalidateメソッド内で使用するメソッド
   * 入力されたメールアドレスとパスワードを既存ユーザーと比較し、正しければUserWithCredential型オブジェクトを返す
   * @param email
   * @param password
   * @returns UserWithRolesAndCredential型(Prismaで取得後のnull可能性を排除した型)のオブジェクト
   */
  async validateUser(email: string, password: string): Promise<UserWithRolesAndCredential> {
    const userCredential = await this.prismaService.userCredential.findUnique({
      where: { email },
    });

    if (!userCredential) {
      throw new UnauthorizedException('Authentication info is invalid.');
    }

    const isPasswordMatched = await compare(password, userCredential.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Authentication info is invalid.');
    }

    const userWithRoles = await this.prismaService.user.findUnique({
      where: { id: userCredential.userId },
      include: { userRoles: { include: { role: true } } },
    });

    if (!userWithRoles) {
      throw new UnauthorizedException('Authentication info is invalid.');
    }

    // MEMO: 現時点でユーザーが結びつくロールは1つのみ
    if (userWithRoles.userRoles.length !== 1) {
      throw new UnauthorizedException('Authentication info is invalid.');
    }

    const returnValue: UserWithRolesAndCredential = { ...userWithRoles, userCredential };

    return returnValue;
  }

  /**
   * ResolveFieldで使用するUserの取得
   * GraphQLにおけるN+1問題への対応をするためにPrismaのfluent APIを用いてデータ取得
   * @param userId 対象ユーザーのid
   * @returns 取得したPrismaのUser型オブジェクト
   */
  async getAuthenticatedUserByUserId(userId: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }
}
