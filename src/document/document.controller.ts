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
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { multerStorageConfig } from 'src/upload_file/multer-config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerStorageConfig('document/')))
  async handleUploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProjectDto: CreateDocumentDto,
  ) {
    // console.log(createProjectDto);
    // console.log(file);
    // return this.uploadFileService.handleUpload(file);
    delete createProjectDto.name;
    console.log(file);
    console.log(createProjectDto);
    if (!file) {
      return this.documentService.create(createProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.documentService.create({
        ...createProjectDto,
        document_file: {
          url: process.env.API_URL + '/' + path,
          type: file.mimetype,
          filename: file.filename,
        },
      });
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', multerStorageConfig('document/')))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() createProjectDto: CreateDocumentDto,
  ) {
    delete createProjectDto.name;
    if (!file) {
      if (createProjectDto.file == 'undefined') {
        delete createProjectDto.file;

        return this.documentService.update(+id, {
          ...createProjectDto,
          document_file: {},
        });
      }
      return this.documentService.update(+id, createProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      console.log(path);
      return this.documentService.update(+id, {
        ...createProjectDto,
        document_file: {
          url: process.env.API_URL + '/' + path,
          type: file.mimetype,
          filename: file.filename,
        },
      });
    }
  }

  @Get(':project_name')
  findAll(@Param('project_name') project_name: string) {
    return this.documentService.findAllByProjectName(project_name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
