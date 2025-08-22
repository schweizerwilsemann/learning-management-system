import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':courseId')
  async create(@Param('courseId') courseId: string, @Body() body: { url: string }) {
    return this.attachmentsService.createAttachment(courseId, body.url);
  }

  @Delete(':courseId/:id')
  async delete(@Param('courseId') courseId: string, @Param('id') id: string) {
    return this.attachmentsService.deleteAttachment(courseId, id);
  }
}
