import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { UploadFileService } from 'src/upload_file/upload_file.service';
@Module({
  controllers: [DocumentController],
  providers: [DocumentService, UploadFileService],
})
export class DocumentModule {}
