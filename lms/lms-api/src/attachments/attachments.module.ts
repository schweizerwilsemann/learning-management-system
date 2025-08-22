import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService, PrismaService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
