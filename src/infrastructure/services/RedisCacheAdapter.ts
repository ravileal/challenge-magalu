import { ICacheService } from '../../application/services/ICacheService';
import redisClient from '../database/redis/client';

export class RedisCacheAdapter implements ICacheService {
  private client = redisClient;

  private getClient() {
    if (!this.client.isOpen) {
      throw new Error('Redis client is not connected.');
    }
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.getClient().get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set(key: string, value: unknown, ttlInSeconds: number): Promise<void> {
    await this.getClient().set(key, JSON.stringify(value), { EX: ttlInSeconds });
  }

  async invalidate(key: string): Promise<void> {
    await this.getClient().del(key);
  }
}
