import { randomFillSync } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  /**
   * Redisに保存する際のkeyの作成
   * @returns string
   */
  generateRandomRedisKey(): string {
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const N = 32;
    return Array.from(randomFillSync(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join('');
  }
}
