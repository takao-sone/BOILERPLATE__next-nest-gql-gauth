import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { compare } from 'bcrypt';
import { EnvService } from '../app-config/env.service';
import { UserWithRolesAndCredential } from '../prisma/custom-types';
import { PrismaService } from '../prisma/prisma.service';
import {
  AppRefreshTokenPayload,
  AppUserInputAccessTokenPayload,
  AppUserInputRefreshTokenPayload,
} from './custom-types';
import { TokenAuth } from './models/auth.model';

@Injectable()
export class TokenAuthenticationService {
  constructor(
    private envService: EnvService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

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
   * ユーザーのログインを処理するメソッド
   * 認証されたユーザーからaccessTokenとrefreshTokenを生成し返却
   * 返却前にrefreshTokenの情報をrefresh_token_rotationsテーブルへ保存
   * @param authenticatedUser
   * @returns Object including accessToken & refreshToken
   */
  async logIn(authenticatedUser: UserWithRolesAndCredential): Promise<TokenAuth> {
    const accessToken = this.generateAccessToken(authenticatedUser);
    const refreshToken = this.generateRefreshToken(authenticatedUser);
    const decodedRefreshTokenPayload = this.jwtService.decode(
      refreshToken,
    ) as AppRefreshTokenPayload | null;

    if (!decodedRefreshTokenPayload) {
      Logger.error(`JWT Decode Error: ${refreshToken}`);
      throw new InternalServerErrorException();
    }

    // Refresh Token Rotation対応
    try {
      await this.prismaService.refreshTokenRotation.create({
        data: {
          refreshToken,
          refreshTokenExp: decodedRefreshTokenPayload.exp,
          user: {
            connect: {
              id: authenticatedUser.id,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          default:
            Logger.error(`Prisma Error Code: ${err.code}, ${err.message}`);
            throw new InternalServerErrorException();
        }
      }

      if (err instanceof Error) {
        Logger.error(err.message);
        throw new InternalServerErrorException();
      }

      throw err;
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async logOut(reqRefreshToken: string): Promise<void> {
    let appRefreshTokenPayload: AppRefreshTokenPayload;

    // RefreshTokenの検証
    try {
      appRefreshTokenPayload = this.jwtService.verify<AppRefreshTokenPayload>(reqRefreshToken, {
        secret: this.envService.getRefreshTokenSecret(),
      });
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(`Refresh Token Error: ${err.message}, ${reqRefreshToken} `);
        throw new UnauthorizedException();
      }

      throw err;
    }

    const userWithRelatedRefreshTokens = await this.prismaService.user.findUnique({
      where: {
        displayedId: appRefreshTokenPayload.sub,
      },
      include: {
        refreshTokenRotations: true,
      },
    });

    if (!userWithRelatedRefreshTokens) {
      Logger.error(`Refresh Token Reuse: No user found.`);
      throw new InternalServerErrorException();
    }

    const refreshTokenRotationHavingReqRefreshToken =
      userWithRelatedRefreshTokens.refreshTokenRotations.find(
        (refreshTokenRotation) => refreshTokenRotation.refreshToken === reqRefreshToken,
      );

    // Refresh Token Reuse detected
    if (!refreshTokenRotationHavingReqRefreshToken) {
      try {
        await this.prismaService.refreshTokenRotation.deleteMany({
          where: {
            user: {
              id: userWithRelatedRefreshTokens.id,
            },
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          switch (err.code) {
            default:
              Logger.error(`logOut: deleteMany, ${err.code}, ${err.message}`);
              throw new InternalServerErrorException();
          }
        }

        throw err;
      }

      Logger.error(`Refresh Token Reuse: No refreshToken from request in DB.`);
      throw new UnauthorizedException();
    }

    // Delete existing (DB stored) refresh token from request.
    try {
      await this.prismaService.refreshTokenRotation.delete({
        where: {
          id: refreshTokenRotationHavingReqRefreshToken.id,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          default:
            Logger.error(`logOut: deleteMany, ${err.code}, ${err.message}`);
            throw new InternalServerErrorException();
        }
      }

      throw err;
    }
  }

  /**
   * アクセストークンを生成するメソッド
   * @param authenticatedUser
   * @returns accessToken
   */
  private generateAccessToken(authenticatedUser: UserWithRolesAndCredential): string {
    const payload: AppUserInputAccessTokenPayload = {
      sub: authenticatedUser.displayedId,
      scope: authenticatedUser.userRoles.map((userRole) => userRole.role.name).join(' '),
    };
    const jwtSignOptions: JwtSignOptions = {
      secret: this.envService.getAccessTokenSecret(),
      algorithm: 'HS256',
      expiresIn: '30m',
    };

    return this.jwtService.sign(payload, jwtSignOptions);
  }

  /**
   * リフレッシュトークンを生成するメソッド
   * @param authenticatedUser
   * @returns refreshToken
   */
  private generateRefreshToken(authenticatedUser: UserWithRolesAndCredential): string {
    const payload: AppUserInputRefreshTokenPayload = {
      sub: authenticatedUser.displayedId,
    };
    const jwtSignOptions: JwtSignOptions = {
      secret: this.envService.getRefreshTokenSecret(),
      algorithm: 'HS256',
      expiresIn: '7d',
    };

    return this.jwtService.sign(payload, jwtSignOptions);
  }
}
