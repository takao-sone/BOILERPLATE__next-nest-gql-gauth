import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { RedisService } from '../redis/redis.service';
import { AppAccessTokenPayload, AppUserInputAccessTokenPayload } from './custom-types';
import { SessionUser } from './dtos/session-user.dto';
import { GoogleTokenAuth } from './models/auth.model';

@Injectable()
export class GoogleAuthenticationService {
  constructor(
    private envService: EnvService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
    @Inject(IORedisKey) private redisClient: Redis,
  ) {}

  /**
   * Google Identityを使用したユーザー登録
   * @param credential Googleのcredential（JWT）
   * @returns GoogleTokenAuth
   */
  async registerGoogleUser(credential: string) {
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
            throw new ConflictException(`sub already exists.`);
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

    const newSessionKey = await this.saveSessionAndKeysOnRedis(sessionUser);

    // アクセストークンの発行
    const accessToken = this.generateAccessToken(sessionUser.displayedId, newSessionKey);
    const googleTokenAuth: GoogleTokenAuth = {
      accessToken,
    };

    return googleTokenAuth;
  }

  /**
   * Google Identityを使用したユーザーログイン
   * @param credential Googleのcredential（JWT）
   * @returns GoogleTokenAuth
   */
  async login(credential: string) {
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

    let existingUser: UserWithRolesAndContactDetailAndProfile;
    try {
      existingUser = await this.getRegisteredUserBySub(payload.sub);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2001':
            throw new NotFoundException(`User does not exist.`);
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

    let sessionUser: SessionUser;
    try {
      sessionUser = this.createSessionUserFromUserWithRolesAndContactDetailAndProfile(existingUser);
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(err.message);
        throw new InternalServerErrorException();
      }
      throw err;
    }

    const newSessionKey = await this.saveSessionAndKeysOnRedis(sessionUser);

    const accessToken = this.generateAccessToken(sessionUser.displayedId, newSessionKey);
    const googleTokenAuth: GoogleTokenAuth = {
      accessToken,
    };

    return googleTokenAuth;
  }

  /**
   * 現在ログインしているユーザーをセッションから削除
   * @param accessToken
   * @param currentSessionUser
   */
  async logout(accessToken: string, currentSessionUser: SessionUser) {
    const decodedAccessTokenPayload = this.jwtService.decode(
      accessToken,
    ) as AppAccessTokenPayload | null;
    if (!decodedAccessTokenPayload) {
      Logger.error(`logout: No AccessToken Payload`);
      throw new InternalServerErrorException('No AccessToken Payload');
    }
    const { session: sessionKey } = decodedAccessTokenPayload;
    const sessionKeysKey =
      this.envService.getRedisExistingSessionPrefix() + ':' + currentSessionUser.displayedId;
    try {
      await this.redisClient
        .multi()
        .del(sessionKey)
        .srem(sessionKeysKey, sessionKey)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .exec((err, _results) => {
          if (!err) return;
          Logger.error(`logout: ${err.message}`);
          throw new InternalServerErrorException();
        });
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(err.message);
        throw new InternalServerErrorException();
      }
      throw err;
    }
  }

  /**
   * フロントエンドからのcredentialを検証しpayloadを取得
   * @param credential フロントエンドから送られてきたGoogle Identityで発行されたcreadential(JWT)
   * @returns TokenPayload
   */
  private async verifyTokenFromFrontend(credential: string) {
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
  private async createGoogleProviderUser(payloadFromGoogle: TokenPayload) {
    const { sub, email, name } = payloadFromGoogle;

    if (!email) {
      Logger.error('googleRegisterUser: No email in payload');
      throw new Error('Email should be configured.');
    }

    // TODO: 最初はADMIN決め打ち
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
   * DBから取得した後に型ガードで絞り込んだuserオブジェクトを取得
   * @param sub Google Identityで取得したpayload中のsubject
   * @returns UserWithRolesAndContactDetailAndProfile
   */
  private async getRegisteredUserBySub(sub: string) {
    const existingUserThirdPartyCredential =
      await this.prismaService.userThirdPartyCredential.findUniqueOrThrow({
        where: {
          sub_provider: {
            sub,
            provider: UserCredentialProvider.GOOGLE,
          },
        },
      });
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: existingUserThirdPartyCredential.userId,
      },
      include: {
        userContactDetail: true,
        userProfile: true,
        userRoles: { include: { role: true } },
      },
    });
    if (!isUserWithRolesAndContactDetailAndProfile(user)) {
      Logger.error(
        `googleRegisterUser: createdUser is not type of UserWithRolesAndContactDetailAndProfile.`,
      );
      throw new Error();
    }
    return user;
  }

  /**
   * DBから取得した後に型ガードで絞り込んだuserオブジェクトをセッション保存用のユーザーに変換
   * @param userWithRolesAndContactDetailAndProfile DBから取得した後に型ガードで絞り込んだuserオブジェクト
   * @returns SessionUser
   */
  private createSessionUserFromUserWithRolesAndContactDetailAndProfile(
    userWithRolesAndContactDetailAndProfile: UserWithRolesAndContactDetailAndProfile,
  ) {
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
  }

  /**
   * アクセストークンの生成
   * @param userDisplayedId user's displayedId
   * @param redisSessionKey redis session key
   * @returns accessToken(JWT)
   */
  private generateAccessToken(userDisplayedId: string, redisSessionKey: string) {
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

  /**
   * "セッション"と"ユーザーごとのセッションキー"をRedisに保存
   * @param sessionUser Redisに保存するユーザーオブジェクト
   * @returns sessionKey 新たに生成されたセッションのキー
   */
  private async saveSessionAndKeysOnRedis(sessionUser: SessionUser) {
    const sessionMaxAgeInSeconds = this.envService.getSessionMaxAgeInSeconds();
    const newSessionKey =
      this.envService.getRedisSessionKeyPrefix() + ':' + this.redisService.generateRandomRedisKey();
    const existingSessionKeysKey =
      this.envService.getRedisExistingSessionPrefix() + ':' + sessionUser.displayedId;
    await this.redisClient
      .multi()
      .set(newSessionKey, JSON.stringify(sessionUser), 'EX', sessionMaxAgeInSeconds)
      .sadd(existingSessionKeysKey, newSessionKey)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .exec((err, _results) => {
        if (!err) return;
        Logger.error(`googleRegisterUser: ${err.message}`);
        throw new InternalServerErrorException();
      });
    return newSessionKey;
  }
}
