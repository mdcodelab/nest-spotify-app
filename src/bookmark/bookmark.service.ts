import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Bookmark } from './bookmark.entity';
import { BookmarkDto } from './dtp/bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly repo: Repository<Bookmark>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  /* =========================
     CREATE
  ========================= */

  async createBookmark(userId: string, dto: BookmarkDto) {
    const bookmark = this.repo.create({
      ...dto,
      user: { id: userId } as any,
    });

    const saved = await this.repo.save(bookmark);

    // 🔥 invalidăm lista userului
    await this.cacheManager.del(`bookmarks:${userId}`);

    return saved;
  }

  /* =========================
     GET ALL (cu caching)
  ========================= */

  async getBookmarksByUser(userId: string) {
    const cacheKey = `bookmarks:${userId}`;

    // 1️⃣ verificăm cache
    const cached = await this.cacheManager.get<Bookmark[]>(cacheKey);
    if (cached) {
      console.log('⚡ Returning bookmarks from Redis');
      return cached;
    }

    // 2️⃣ fallback la DB
    console.log('💾 Fetching bookmarks from DB');

    const bookmarks = await this.repo.find({
      where: { user: { id: userId } as any },
    });

    // 3️⃣ salvăm în Redis (60 sec)
    await this.cacheManager.set(cacheKey, bookmarks, 60);

    return bookmarks;
  }

  /* =========================
     GET ONE (cu caching)
  ========================= */

  async getBookmarkById(id: string, userId: string) {
    const cacheKey = `bookmark:${id}:user:${userId}`;

    const cached = await this.cacheManager.get<Bookmark>(cacheKey);
    if (cached) {
      console.log('⚡ Returning single bookmark from Redis');
      return cached;
    }

    const bookmark = await this.repo.findOne({
      where: { id, user: { id: userId } as any },
    });

    if (bookmark) {
      await this.cacheManager.set(cacheKey, bookmark, 60);
    }

    return bookmark;
  }

  /* =========================
     DELETE (cu invalidare cache)
  ========================= */

  async deleteBookmark(id: string, userId: string) {
    await this.repo.delete({
      id,
      user: { id: userId } as any,
    });

    // 🔥 invalidăm cache listă
    await this.cacheManager.del(`bookmarks:${userId}`);

    // 🔥 invalidăm cache item individual
    await this.cacheManager.del(`bookmark:${id}:user:${userId}`);

    return { message: 'Bookmark deleted' };
  }
}
