import { Controller, Post, Body } from '@nestjs/common';
import { MediaService, deleteMediaAction } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('presign')
  async presign(@Body() body: { filename: string; ref: string }) {
    return this.mediaService.generatePresignedUrl(body.filename, body.ref);
  }

  @Post('delete')
  async delete(@Body() body: { url: string }) {
    return deleteMediaAction(body.url);
  }
}
