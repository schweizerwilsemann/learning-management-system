import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TranscodeService {
  constructor(private prisma: PrismaService) {}

  async handleTranscodeSuccess(message: string, resolutions: string[]) {
    try {
      const parsedUrl = new URL(resolutions[0]);
      const pathname = parsedUrl.pathname;
      const segments = pathname.split('/');
      const chapterId = segments[segments.length - 2];

      await this.prisma.chapter.update({
        where: { id: chapterId },
        data: {
          resolutions: resolutions,
          isVideoProcessing: false,
        },
        select: { courseId: true },
      });

      return { success: true, message };
    } catch (error) {
      throw new Error(`Failed to update chapter: ${error.message}`);
    }
  }
}
