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
import { AppAccessTokenPayload, AppRefreshTokenPayload } from './custom-types';

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
   * 認証されたユーザーからaccessTokenとrefreshTokenを生成して返却
   * @param authenticatedUser
   * @returns Object including accessToken & refreshToken
   */
  async logIn(authenticatedUser: UserWithRolesAndCredential) {
    const accessToken = this.generateAccessToken(authenticatedUser);
    const refreshToken = this.generateRefreshToken(authenticatedUser);

    // Refresh Token Rotation対応
    try {
      await this.prismaService.refreshTokenRotations.create({
        data: {
          refreshToken,
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

  // private async updateRefreshToken(refreshToken: string) {
  //   const hashedRefreshToken = await hash(refreshToken, this.ENCRYPTION_SALT_ROUNDS);
  //   try {
  //     this.prismaService.refreshTokenRotations.create({
  //       data: {
  //         hashedRefreshToken,
  //         user: {
  //           connect: {
  //             id: authenticatedUser.id,
  //           },
  //         },
  //       },
  //     });
  //   } catch (err) {
  //     if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //       switch (err.code) {
  //         case 'P2002':
  //           throw new ConflictException(`Email ${email} already used.`);
  //         default:
  //           Logger.error(`Prisma Error Code: ${err.code}, ${err.message}`);
  //           throw new InternalServerErrorException();
  //       }
  //     }

  //     if (err instanceof Error) {
  //       Logger.error(err.message);
  //       throw new InternalServerErrorException();
  //     }

  //     throw err;
  //   }
  // }

  /**
   * アクセストークンを生成するメソッド
   * @param authenticatedUser
   * @returns accessToken
   */
  private generateAccessToken(authenticatedUser: UserWithRolesAndCredential) {
    const payload: AppAccessTokenPayload = {
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
  private generateRefreshToken(authenticatedUser: UserWithRolesAndCredential) {
    const payload: AppRefreshTokenPayload = {
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
