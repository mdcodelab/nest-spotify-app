import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  private readonly LIMIT = 10; // maxim 10 requesturi
  private readonly TTL = 60; // 60 secunde

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    const key = `rate-limit:${ip}`;

    const current = (await this.cacheManager.get<number>(key)) || 0;

    if (current >= this.LIMIT) {
      throw new HttpException(
        'Too many requests. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.cacheManager.set(key, current + 1, 
        { ttl: this.TTL } as any);





    return true;
  }
}
