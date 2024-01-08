import { Module } from '@nestjs/common';
import { ImageVideoService } from './image-video.service';
import { ImageVideoController } from './image-video.controller';
import { UploadFileService } from 'src/upload_file/upload_file.service';

@Module({
  controllers: [ImageVideoController],
  providers: [ImageVideoService, UploadFileService],
})
export class ImageVideoModule {}
