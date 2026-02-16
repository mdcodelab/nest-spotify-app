import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-ioredis';

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // sau numele containerului Docker
      port: 6379,
      ttl: 5, // timp default în secunde
    }),
  ],
  exports: [CacheModule],
  providers: [RedisService],
})
export class RedisModule {}
