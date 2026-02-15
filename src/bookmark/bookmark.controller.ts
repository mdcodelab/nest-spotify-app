import { Body, Controller, Delete, Get, Param, 
    Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmark.service';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { BookmarkDto } from './dtp/bookmark.dto';
import { User } from 'src/user/user.entity';


@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post() //by input
  create(@Body() dto: BookmarkDto, @Req() req: any) {
    const user = req.user as User;
    return this.bookmarksService.createBookmark(user.id, dto);
  }

  @Get()
  getBookmarks(@Req() req: any) {
    let user = req.user as User
    return this.bookmarksService.getBookmarksByUser(user.id);
  }

  @Get(":id")
  getOne(@Param("id") id: string, @Req() req: any) {
    let user = req.user as User
    return this.bookmarksService.getBookmarkById(id, user.id);
  }
}
