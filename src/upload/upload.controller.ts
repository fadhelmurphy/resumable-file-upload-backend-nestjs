import { Controller, Post, Body, Get, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadChunkDto } from './dto/upload-chunk/upload-chunk';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('chunk/status')
  async getUploadedChunks(@Query('fileKey') fileKey: string) {
    if (!fileKey) {
      throw new Error('File key is required');
    }

    return this.uploadService.getUploadedChunks(fileKey);
  }

  @Post('chunk')
  @UseInterceptors(FileInterceptor('file'))
  handleChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadChunkDto: UploadChunkDto,
  ) {
    return this.uploadService.handleChunk(file, uploadChunkDto);
  }

  @Post('merge')
  mergeChunks(@Body('fileKey') fileKey: string) {
    return this.uploadService.mergeChunks(fileKey);
  }
}
