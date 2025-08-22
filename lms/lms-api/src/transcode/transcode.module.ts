import { Module } from '@nestjs/common';
import { TranscodeController } from './transcode.controller';
import { TranscodeService } from './transcode.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TranscodeController],
  providers: [TranscodeService],
})
export class TranscodeModule {}
