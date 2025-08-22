import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TranscodeService } from './transcode.service';

class TranscodeSuccessDto {
  message: string;
  resolutions: string[];
}

@ApiTags('Transcode')
@Controller('transcode')
export class TranscodeController {
  constructor(private readonly transcodeService: TranscodeService) {}

  @Post('success')
  @ApiOperation({ summary: 'Handle transcode success callback' })
  @ApiResponse({ status: 200, description: 'Transcode success handled' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handleTranscodeSuccess(@Body() body: TranscodeSuccessDto) {
    const { message, resolutions } = body;
    return this.transcodeService.handleTranscodeSuccess(message, resolutions);
  }
}
