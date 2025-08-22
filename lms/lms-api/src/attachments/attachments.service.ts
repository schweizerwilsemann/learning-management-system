import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { deleteMediaAction } from '@/media/media.service';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  async createAttachment(courseId: string, url: string) {
    const attachment = await this.prisma.attachment.create({ data: { url, name: url.split('/').pop()!, courseId } });
    return { message: 'Attachment added successfully!', success: true, attachment };
  }

  async deleteAttachment(courseId: string, id: string) {
    const attachment = await this.prisma.attachment.delete({ where: { id, courseId } });
    try { await deleteMediaAction(attachment.url); } catch {}
    return { message: 'Attachment deleted successfully!', success: true, attachment };
  }
}
