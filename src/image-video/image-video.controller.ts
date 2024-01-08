import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageVideoService } from './image-video.service';
import { CreateImageVideoDto } from './dto/create-image-video.dto';
import { UpdateImageVideoDto } from './dto/update-image-video.dto';
import { multerStorageConfigForImageVideo } from 'src/upload_file/multer-config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image-video')
export class ImageVideoController {
  constructor(private readonly imageVideoService: ImageVideoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', multerStorageConfigForImageVideo('image-video')),
  )
  async handleUploadImageVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProjectDto: CreateImageVideoDto,
  ) {
    return this.imageVideoService.create(createProjectDto, file);
  }

  @Get('getImage/:project_name/:type')
  async findImageByProjectName(
    @Param('project_name') project_name: string,
    @Param('type') type: string,
  ) {
    return this.imageVideoService.findImageByProjectNameAndType(
      project_name,
      type,
    );
  }

  @Get(':project_name/:type')
  async findAllByProjectName(
    @Param('project_name') project_name: string,
    @Param('type') type: string,
  ) {
    return this.imageVideoService.findAllByProjectNameAndType(
      project_name,
      type,
    );
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', multerStorageConfigForImageVideo('image-video')),
  )
  async handleUpdateData(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProjectDto: CreateImageVideoDto,
    @Param('id') id: string,
  ) {
    return this.imageVideoService.update(+id, createProjectDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageVideoService.remove(+id);
  }
}
