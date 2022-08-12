import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Prisma, RefreshTokenRotation, Role } from '@prisma/client';
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
    const { id, displayedId, userRoles } = authenticatedUser;
    const roles = userRoles.map((userRole) => userRole.role);
    const accessToken = this.generateAccessToken(displayedId, roles);
    const refreshToken = this.generateRefreshToken(displayedId);

    // Refresh Token Rotation対応
    await this.storeNewRefreshToken(refreshToken, id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logOut(reqRefreshToken: string): Promise<void> {
    // Inspect a refresh token itself
    const appRefreshTokenPayload = this.verifyRefreshToken(reqRefreshToken);

    // Inspec if refresh token reuse is attempted or not
    const refreshTokenRotationHavingReqRefreshToken = await this.inspectRefreshTokenReuse(
      appRefreshTokenPayload.sub,
      reqRefreshToken,
    );

    // Delete existing (DB stored) refresh token
    await this.deleteExistingDbStoredRefreshTokenRotation(
      refreshTokenRotationHavingReqRefreshToken.id,
    );
  }

  async refreshTokens(reqRefreshToken: string): Promise<TokenAuth> {
    // Inspect a refresh token itself
    const appRefreshTokenPayload = this.verifyRefreshToken(reqRefreshToken);

    // Inspec if refresh token reuse is attempted or not
    const refreshTokenRotationHavingReqRefreshToken = await this.inspectRefreshTokenReuse(
      appRefreshTokenPayload.sub,
      reqRefreshToken,
    );

    // Delete existing (DB stored) refresh token
    await this.deleteExistingDbStoredRefreshTokenRotation(
      refreshTokenRotationHavingReqRefreshToken.id,
    );

    // Generate new access & refresh tokens
    const userWithRoles = await this.prismaService.user.findUnique({
      where: {
        displayedId: appRefreshTokenPayload.sub,
      },
      include: {
        userRoles: { include: { role: true } },
      },
    });

    if (!userWithRoles) {
      Logger.error(`refreshTokens Error: user Not found`);
      throw new InternalServerErrorException();
    }

    const { id, displayedId, userRoles } = userWithRoles;
    const roles = userRoles.map((userRole) => userRole.role);
    const newAccessToken = this.generateAccessToken(displayedId, roles);
    const newRefreshToken = this.generateRefreshToken(displayedId);

    // Store a new refresh token for Refresh Token Rotation
    await this.storeNewRefreshToken(newRefreshToken, id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * アクセストークンを生成するメソッド
   * @param userDisplayedId user's displayedId
   * @param roles array of Role object
   * @returns accessToken
   */
  private generateAccessToken(userDisplayedId: string, roles: Role[]): string {
    const payload: AppUserInputAccessTokenPayload = {
      sub: userDisplayedId,
      scope: roles.map((userRole) => userRole.name).join(' '),
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
   * @param userDisplayedId user's displayedId
   * @returns refreshToken
   */
  private generateRefreshToken(userDisplayedId: string): string {
    const payload: AppUserInputRefreshTokenPayload = {
      sub: userDisplayedId,
    };
    const jwtSignOptions: JwtSignOptions = {
      secret: this.envService.getRefreshTokenSecret(),
      algorithm: 'HS256',
      expiresIn: '7d',
    };

    return this.jwtService.sign(payload, jwtSignOptions);
  }

  /**
   * 新しく生成されたリフレッシュトークンをRefresh Token RotationのためにDBへ保存するメソッド
   * @param newRefreshToken refresh token which will be stored in DB
   * @param userId user's id related a new refresh token
   */
  async storeNewRefreshToken(newRefreshToken: string, userId: number): Promise<void> {
    const decodedNewRefreshTokenPayload = this.jwtService.decode(
      newRefreshToken,
    ) as AppRefreshTokenPayload | null;

    if (!decodedNewRefreshTokenPayload) {
      Logger.error(`JWT Decode Error: ${newRefreshToken}`);
      throw new InternalServerErrorException();
    }

    try {
      await this.prismaService.refreshTokenRotation.create({
        data: {
          refreshToken: newRefreshToken,
          refreshTokenExp: decodedNewRefreshTokenPayload.exp,
          user: {
            connect: {
              id: userId,
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
  }

  /**
   * リフレッシュトークンを検証するメソッド
   * @param verifiedRefreshToken a verified refresh token
   * @returns a new refresh token
   */
  private verifyRefreshToken(verifiedRefreshToken: string): AppRefreshTokenPayload {
    try {
      return this.jwtService.verify<AppRefreshTokenPayload>(verifiedRefreshToken, {
        secret: this.envService.getRefreshTokenSecret(),
      });
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(`Refresh Token Error: ${err.message}, ${verifiedRefreshToken} `);
        throw new UnauthorizedException();
      }

      throw err;
    }
  }

  /**
   * リフレッシュトークンの再利用を検証するメソッド
   * 再利用が検出されれば関連するユーザーに紐づくリフレッシュトークンすべてを削除してからエラー
   * 再利用が検出されなければリクエストされたリフレッシュトークンを含むRefreshTokenRotationオブジェクトを返却
   * @param subFromRefreshTokenPayload sub from a requested refresh token
   * @param reqRefreshToken a requested refresh token
   * @returns RefreshTokenRotation object having a requested refresh token (if refresh token reuse is not detected)
   */
  async inspectRefreshTokenReuse(
    subFromRefreshTokenPayload: string,
    reqRefreshToken: string,
  ): Promise<RefreshTokenRotation> {
    const userWithRelatedRefreshTokens = await this.prismaService.user.findUnique({
      where: {
        displayedId: subFromRefreshTokenPayload,
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

    // Detect Refresh Token Reuse
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

    // NO Refresh Token Reuse
    return refreshTokenRotationHavingReqRefreshToken;
  }

  /**
   * DBに保存されているリフレッシュトークンを1つ削除するメソッド
   * 削除する実態はrefresh_token_rotationsテーブルのレコード
   * @param deletingRefreshTokenRotationId deleting refresh token rotation's id
   */
  async deleteExistingDbStoredRefreshTokenRotation(
    deletingRefreshTokenRotationId: number,
  ): Promise<void> {
    try {
      await this.prismaService.refreshTokenRotation.delete({
        where: {
          id: deletingRefreshTokenRotationId,
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
}
