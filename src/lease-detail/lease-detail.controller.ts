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
import { LeaseDetailService } from './lease-detail.service';
import { CreateLeaseDetailDto } from './dto/create-lease-detail.dto';
import { UpdateLeaseDetailDto } from './dto/update-lease-detail.dto';
import { leaseMulterStorageConfig } from 'src/upload_file/multer-config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('lease-detail')
export class LeaseDetailController {
  constructor(private readonly leaseDetailService: LeaseDetailService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', leaseMulterStorageConfig('lease')))
  async handleUploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProjectDto: CreateLeaseDetailDto,
  ) {
    // console.log(createProjectDto);
    // console.log(file);
    // return this.uploadFileService.handleUpload(file);
    delete createProjectDto.name;
    if (!file) {
      return this.leaseDetailService.create(createProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.leaseDetailService.create({
        ...createProjectDto,
        download: {
          url: process.env.API_URL + '/' + path,
          type: file.mimetype,
          filename: file.filename,
        },
      });
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', leaseMulterStorageConfig('lease')))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() createProjectDto: CreateLeaseDetailDto,
  ) {
    delete createProjectDto.name;
    if (!file) {
      if (createProjectDto.file == 'undefined') {
        delete createProjectDto.file;
        return this.leaseDetailService.update(+id, {
          ...createProjectDto,
          download: {},
        });
      }
      return this.leaseDetailService.update(+id, createProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.leaseDetailService.update(+id, {
        ...createProjectDto,
        download: {
          url: process.env.API_URL + '/' + path,
          type: file.mimetype,
          filename: file.filename,
        },
      });
    }
    // console.log('update');
    // console.log(createProjectDto);
    // console.log(file);
    // return this.uploadFileService.handleUpload(file);
    // if (!file) {
    //   return this.leaseDetailService.create(createProjectDto);
    // } else {
    //   const path = file.path.split('\\').join('/');
    //   return this.leaseDetailService.create({
    //     ...createProjectDto,
    //     logo: {
    //       url: process.env.API_URL + '/' + path,
    //     },
    //   });
    // }
  }

  @Post('/findLeaseByWindName')
  findLeaseByWindName(@Body() body: any) {
    const { project_name, wind_name } = body;
    console.log(body);
    return this.leaseDetailService.findLeaseByWindName(project_name, wind_name);
  }

  @Get(':project_name')
  findAll(@Param('project_name') project_name: string) {
    return this.leaseDetailService.findAllByProjectName(project_name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaseDetailService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaseDetailService.remove(+id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.leaseDetailService.remove(+id);
  // }
}
