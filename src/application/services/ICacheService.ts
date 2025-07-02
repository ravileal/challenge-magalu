export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlInSeconds: number): Promise<void>;
  invalidate(key: string): Promise<void>;
}
