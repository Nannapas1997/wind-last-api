import { Global, Module } from '@nestjs/common';
import { UploadFileController } from './upload_file.controller';
import { UploadFileService } from './upload_file.service';

@Global()
@Module({
  imports: [],
  controllers: [UploadFileController],
  providers: [UploadFileService],
})
export class UploadFileModule {}
