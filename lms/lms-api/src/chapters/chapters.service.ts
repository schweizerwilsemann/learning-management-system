import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { deleteMediaAction } from '@/media/media.service';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  async createChapter(courseId: string, { title }: { title: string }) {
    const lastChapter = await this.prisma.chapter.findFirst({ where: { courseId }, orderBy: { position: 'desc' } });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const chapter = await this.prisma.chapter.create({ data: { title, courseId, position: newPosition } });
    return { message: 'Chapter created successfully!', success: true, chapter };
  }

  async reorderChapters(courseId: string, list: any) {
    for (let item of list) {
      await this.prisma.chapter.update({ where: { id: item.id }, data: { position: item.position } });
    }
    return { message: 'Chapter reordered!', success: true };
  }

  async updateChapter(chapterId: string, courseId: string, values: any) {
    const chapter = await this.prisma.chapter.update({ where: { id: chapterId, courseId }, data: { ...values } as any });
    return { message: 'Chapter updated successfully!', success: true, chapter };
  }

  async deleteChapter(chapterId: string, courseId: string) {
    const deletedChapter = await this.prisma.chapter.delete({ where: { id: chapterId, courseId } });
    for (const resolution of deletedChapter.resolutions || []) {
      try { await deleteMediaAction(resolution); } catch {}
    }
    const publishedChaptersInCourse = await this.prisma.chapter.findMany({ where: { courseId, isPublished: true } });
    if (!publishedChaptersInCourse.length) {
      await this.prisma.course.update({ where: { id: courseId }, data: { status: 'DRAFT' } });
    }
    return { message: 'Chapter deleted successfully!', success: true, chapter: deletedChapter };
  }

  async publishChapter(chapterId: string, courseId: string) {
    const publishedChapter = await this.prisma.chapter.update({ where: { id: chapterId, courseId }, data: { isPublished: true } });
    return { message: 'Chapter published successfully!', success: true, chapter: publishedChapter };
  }

  async unpublishChapter(chapterId: string, courseId: string) {
    const unpublishedChapter = await this.prisma.chapter.update({ where: { id: chapterId, courseId }, data: { isPublished: false } });
    const publishedChaptersInCourse = await this.prisma.chapter.findMany({ where: { courseId, isPublished: true } });
    if (!publishedChaptersInCourse.length) {
      await this.prisma.course.update({ where: { id: courseId }, data: { status: 'DRAFT' } });
    }
    return { message: 'Chapter unpublished successfully!', success: true, chaper: unpublishedChapter };
  }

  async getChapterById(chapterId: string, userId?: string) {
    const chapter = await this.prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) return { success: false, message: 'Chapter not found' };

    let isPurchased = false;
    if (userId && chapter.courseId) {
      const purchase = await this.prisma.purchase.findFirst({ where: { courseId: chapter.courseId, userId } });
      isPurchased = !!purchase;
    }

    return { success: true, chapter, isPurchased };
  }
}
