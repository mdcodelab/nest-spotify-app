import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { Bookmark } from './bookmark/bookmark.entity';
import { User } from './user/user.entity';
import { RedisModule } from './redis/redis.module';
import { BookmarksService } from './bookmark/bookmark.service';
import { BookmarksController } from './bookmark/bookmark.controller';

@Module({
  imports: [
    // ConfigModule pentru variabilele din .env
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM configurat pentru Postgres
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),    
        port: +config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Bookmark, User],
        synchronize: true, // doar pentru development
      }),
    }),

    // Modulele tale
    AuthModule,
    UserModule,
    BookmarkModule,
    RedisModule,
  ],
  controllers: [AppController, BookmarksController],
  providers: [AppService, BookmarksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
