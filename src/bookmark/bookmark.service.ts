import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from '../user/dto/editUser.dto';
import { CreateBookmarkDto } from './dto/createBookmark.dto';
import { EditBookmarkDto } from './dto/editBookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    let newBookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return newBookmark;
  }
  async getBookmarks(userId: number) {
    let bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    return bookmarks;
  }
  async getBookmarkById(userId: number, bookmarkId: number) {
    let bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });

    return bookmark;
  }
  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    let bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || userId !== bookmark?.userId) {
      throw new ForbiddenException('Access to resources denied');
    }
    let updateBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
    return updateBookmark;
  }
  async deleteBookmarkById(userId: number, bookmarkId: number) {
    let bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || userId !== bookmark?.userId) {
      throw new ForbiddenException('Access to resources denied');
    }
    let delBookmark = await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return delBookmark;
  }
}
