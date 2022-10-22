import { randomFillSync } from 'crypto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Prisma, RoleName, UserCredentialProvider } from '@prisma/client';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import Redis from 'ioredis';
import { EnvService } from '../app-config/env.service';
import { isUserWithRolesAndContactDetailAndProfile } from '../prisma/custom-type-guards';
import { UserWithRolesAndContactDetailAndProfile } from '../prisma/custom-types';
import { PrismaService } from '../prisma/prisma.service';
import { IORedisKey } from '../redis/redis.module';
import { AppUserInputAccessTokenPayload } from './custom-types';
import { SessionUser } from './dtos/session-user.dto';
import { GoogleTokenAuth } from './models/auth.model';

@Injectable()
export class GoogleAuthenticationService {
  constructor(
    private envService: EnvService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(IORedisKey) private redisClient: Redis,
  ) {}

  async registerGoogleUser(credential: string): Promise<GoogleTokenAuth> {
    // フロントエンドで取得したcredentialが改竄されていないかの検証とpayloadの取得
    let payload: TokenPayload;
    try {
      payload = await this.verifyTokenFromFrontend(credential);
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(err.message);
        throw new InternalServerErrorException();
      }

      throw err;
    }

    // payloadからユーザーを作成
    let createdUser: UserWithRolesAndContactDetailAndProfile;
    try {
      createdUser = await this.createGoogleProviderUser(payload);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            throw new ConflictException(`sub already used.`);
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

    // セッション用ユーザーオブジェクトの作成
    let sessionUser: SessionUser;
    try {
      sessionUser = this.createSessionUserFromUserWithRolesAndContactDetailAndProfile(createdUser);
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(err.message);
        throw new InternalServerErrorException();
      }

      throw err;
    }

    // Redisへセッション用ユーザーオブジェクトを保存
    const redisSessionKey = this.generateRandomRedisKey();
    try {
      const sessionMaxAgeInSeconds = this.envService.getSessionMaxAgeInSeconds();
      await this.redisClient.set(
        redisSessionKey,
        JSON.stringify(sessionUser),
        'EX',
        sessionMaxAgeInSeconds,
      );
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(`googleRegisterUser: ${err.message}`);
        throw new HttpException('Session Destroy Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      throw err;
    }

    // アクセストークンの発行
    const accessToken = this.generateAccessToken(sessionUser.displayedId, redisSessionKey);

    return {
      accessToken,
    };
  }

  /**
   * フロントエンドからのcredentialを検証しpayloadを取得
   * @param credential フロントエンドから送られてきたGoogle Identityで発行されたcreadential(JWT)
   * @returns TokenPayload
   */
  private async verifyTokenFromFrontend(credential: string): Promise<TokenPayload> {
    const clientId = this.envService.getGoogleCleintId();
    const client = new OAuth2Client(clientId);
    const loginTicket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = loginTicket.getPayload();

    if (!payload) {
      Logger.error(`googleRegisterUser: No payload in loginTicket`);
      throw new Error();
    }

    return payload;
  }

  /**
   * googleからのpayloadを用いてユーザーを作成
   * @param payloadFromGoogle Google Identityの検証用APIで検証済みのpayload
   * @returns UserWithRolesAndContactDetailAndProfile
   */
  private async createGoogleProviderUser(
    payloadFromGoogle: TokenPayload,
  ): Promise<UserWithRolesAndContactDetailAndProfile> {
    const { sub, email, name } = payloadFromGoogle;

    if (!email) {
      Logger.error('googleRegisterUser: No email in payload');
      throw new Error('Email should be configured.');
    }

    const adminRole = await this.prismaService.role.findUnique({
      where: {
        name: RoleName.ADMIN,
      },
    });

    if (!adminRole) {
      Logger.error('googleRegisterUser: adminRole is null');
      throw new Error();
    }

    const createdUser = await this.prismaService.user.create({
      include: {
        userContactDetail: true,
        userProfile: true,
        userRoles: { include: { role: true } },
      },
      data: {
        userThirdPartyCredential: {
          create: {
            sub,
            provider: UserCredentialProvider.GOOGLE,
          },
        },
        userContactDetail: {
          create: {
            email,
          },
        },
        userProfile: {
          create: {
            name: name ?? email,
          },
        },
        userRoles: {
          create: {
            role: {
              connect: {
                displayedId: adminRole.displayedId,
              },
            },
          },
        },
      },
    });

    if (!isUserWithRolesAndContactDetailAndProfile(createdUser)) {
      Logger.error(
        `googleRegisterUser: createdUser is not type of UserWithRolesAndContactDetailAndProfile.`,
      );
      throw new Error();
    }

    return createdUser;
  }

  /**
   * DBから取得した後に型ガードで絞り込んだuserオブジェクトをセッション保存用のユーザーに変換
   * @param userWithRolesAndContactDetailAndProfile DBから取得した後に型ガードで絞り込んだuserオブジェクト
   * @returns SessionUser
   */
  private createSessionUserFromUserWithRolesAndContactDetailAndProfile = (
    userWithRolesAndContactDetailAndProfile: UserWithRolesAndContactDetailAndProfile,
  ) => {
    const { userRoles } = userWithRolesAndContactDetailAndProfile;

    if (!userRoles[0]) {
      Logger.error(
        'createSessionUserFromUserWithRolesAndContactDetailAndProfile: userRole is undefined.',
      );
      throw new Error();
    }

    const sessionUser: SessionUser = {
      id: userWithRolesAndContactDetailAndProfile.id,
      displayedId: userWithRolesAndContactDetailAndProfile.displayedId,
      userContactDetail: {
        email: userWithRolesAndContactDetailAndProfile.userContactDetail.email,
      },
      userProfile: {
        name: userWithRolesAndContactDetailAndProfile.userProfile.name,
      },
      userRole: {
        displayedId: userRoles[0].role.displayedId,
        name: userRoles[0].role.name,
      },
    };

    return sessionUser;
  };

  /**
   * セッションユーザーをRedisに保存する際のkeyの作成
   * @returns string
   */
  private generateRandomRedisKey(): string {
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const N = 32;
    return Array.from(randomFillSync(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join('');
  }

  /**
   * アクセストークンを生成
   * @param userDisplayedId user's displayedId
   * @param redisSessionKey redis session key
   * @returns accessToken(JWT)
   */
  private generateAccessToken(userDisplayedId: string, redisSessionKey: string): string {
    const payload: AppUserInputAccessTokenPayload = {
      iss: this.envService.getJwtIssuer(),
      aud: [this.envService.getJwtAudienceWeb()],
      sub: userDisplayedId,
      session: redisSessionKey,
    };
    const jwtSignOptions: JwtSignOptions = {
      secret: this.envService.getAccessTokenSecret(),
      algorithm: this.envService.getJwtHashAlgorithm(),
      expiresIn: this.envService.getAccessTokenExpiresIn(),
    };

    return this.jwtService.sign(payload, jwtSignOptions);
  }
}
