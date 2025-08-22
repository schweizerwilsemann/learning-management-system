import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ChaptersController],
  providers: [ChaptersService, PrismaService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
