import { Controller, Post, Body, Param, Put, Delete, Get } from '@nestjs/common';
import { ChaptersService } from './chapters.service';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post(':courseId')
  async create(@Param('courseId') courseId: string, @Body() body: { title: string }) {
    return this.chaptersService.createChapter(courseId, body);
  }

  @Put(':chapterId')
  async update(@Param('chapterId') chapterId: string, @Body() body: any) {
    return this.chaptersService.updateChapter(chapterId, body.courseId, body.values);
  }

  @Post(':courseId/reorder')
  async reorder(@Param('courseId') courseId: string, @Body() body: any) {
    return this.chaptersService.reorderChapters(courseId, body.list);
  }

  @Delete(':chapterId')
  async delete(@Param('chapterId') chapterId: string, @Body() body: any) {
    return this.chaptersService.deleteChapter(chapterId, body.courseId);
  }

  @Post(':chapterId/publish')
  async publish(@Param('chapterId') chapterId: string, @Body() body: any) {
    return this.chaptersService.publishChapter(chapterId, body.courseId);
  }

  @Post(':chapterId/unpublish')
  async unpublish(@Param('chapterId') chapterId: string, @Body() body: any) {
    return this.chaptersService.unpublishChapter(chapterId, body.courseId);
  }

  @Get(':chapterId')
  async getChapter(@Param('chapterId') chapterId: string, @Body() body: any) {
    // body may contain userId if provided
    const userId = body?.userId;
    return this.chaptersService.getChapterById(chapterId, userId);
  }
}
