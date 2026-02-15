import { Injectable } from '@nestjs/common';
import { BookmarkDto } from './dtp/bookmark.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './bookmark.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly repo: Repository<Bookmark>,
  ) {}

  async createBookmark(userId: string, dto: BookmarkDto) {
    const bookmark = this.repo.create({
      ...dto,
      user: { id: userId } as any,
    });
    return this.repo.save(bookmark);
  }

  async getBookmarksByUser(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } as any },
    });
  }

  async getBookmarkById(id: string, userId: string) {
    return this.repo.findOne({
      where: { id, user: { id: userId } as any },
    });
  }
}
