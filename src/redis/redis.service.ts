import { Injectable, Inject, OnModuleInit } 
from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: any,
  ) {}

  async onModuleInit() {
    try {
      await this.cacheManager.set('startup', 'ok', { ttl: 5 });
      console.log('✅ Redis connected successfully');
    } catch (error) {
      console.error('❌ Redis connection failed', error);
    }
  }
}
