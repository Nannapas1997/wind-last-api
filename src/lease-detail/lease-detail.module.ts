import { Module } from '@nestjs/common';
import { LeaseDetailService } from './lease-detail.service';
import { LeaseDetailController } from './lease-detail.controller';
import { UploadFileService } from '../upload_file/upload_file.service';
@Module({
  controllers: [LeaseDetailController],
  providers: [LeaseDetailService, UploadFileService],
})
export class LeaseDetailModule {}
