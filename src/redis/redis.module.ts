import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
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
})
export class RedisModule {}
