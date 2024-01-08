import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { JwtService } from '@nestjs/jwt';
import { UploadFileService } from '../upload_file/upload_file.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, JwtService, UploadFileService],
})
export class ProjectModule {}
