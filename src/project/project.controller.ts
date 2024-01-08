import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  Req,
  UseInterceptors,
  Param,
  BadRequestException,
  Delete,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { UpdateProjectDto } from './dto/update-project.dto';
import { multerStorageConfig } from 'src/upload_file/multer-config';
const fs = require('fs');

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    console.log(createProjectDto);
    // return this.projectService.create(createProjectDto);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('file', multerStorageConfig('logo/')))
  async handleUploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    // return this.uploadFileService.handleUpload(file);
    if (!file) {
      return this.projectService.create(createProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.projectService.create({
        ...createProjectDto,
        logo: {
          url: process.env.API_URL + '/' + path,
        },
      });
    }
  }

  @Get('getRadiusTurbine/:projectName')
  async getRadiusTurbine(@Param('projectName') projectName: string) {
    return await this.projectService.getRadiusTurbine(projectName);
  }

  @Get('getCategory/:projectName')
  async getCategory(@Param('projectName') projectName: string) {
    return await this.projectService.getCategory(projectName);
  }

  @Patch('updateArea/:projectName')
  async updateArea(
    @Param('projectName') projectName: string,
    @Body() data: any,
  ) {
    return await this.projectService.updateArea(projectName, data);
  }

  @Get('getMapsData/:projectName')
  async getMapsData(@Param('projectName') projectName: string) {
    return await this.projectService.getMapsData(projectName);
  }

  @Patch('updateMapsDetail')
  async updateMapsData(@Body() data: any) {
    return await this.projectService.updateMapsDetail(data);
  }

  @Patch('updateMultiplePath/:projectName')
  async updateMultiplePath(
    @Param('projectName') projectName: string,
    @Body() data: any,
  ) {
    return await this.projectService.updateMultiplePath(projectName, data);
  }

  @Delete('path/:id')
  async deletePath(@Param('id') id: number) {
    return await this.projectService.deletePath(id);
  }

  @Post('uploadMapsImage')
  async handleUploadMaps(@Body() mapsData: any) {
    let fullPath = '';
    const { base64, projectName } = mapsData;
    try {
      const path = 'uploads/project/' + projectName + '/maps/';
      const base64Data = base64.replace(/^data:image\/png;base64,/, '');
      mkdirSync(path, { recursive: true });

      const filename = `${projectName}-${Date.now()}.png`;
      fullPath = `${path}${filename}`;

      const imgBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buf = Buffer.from(imgBase64, 'base64');
      fs.writeFileSync(fullPath, buf);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return await this.projectService.createMapsData(
      projectName,
      process.env.API_URL + '/' + fullPath,
    );
  }

  @Post('createMapsData')
  async createMapsData(@Body() mapsData: any) {
    const { projectName, data } = mapsData;
    return await this.projectService.createMapsDataDetail(projectName, data);
  }

  @Post('updateProject/:id')
  @UseInterceptors(FileInterceptor('file', multerStorageConfig('logo/')))
  async updateProject(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    // return this.uploadFileService.handleUpload(file);
    // uploads\project\โครงการลมเกาะใหญ่2345\web.facebook.com_98itstore-1700406817917-481307901.png

    if (!file) {
      if (updateProjectDto.file == 'undefined') {
        delete updateProjectDto.file;
        return this.projectService.update(+id, {
          ...updateProjectDto,
          logo: null,
        });
      }
      return this.projectService.update(+id, updateProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.projectService.update(+id, {
        ...updateProjectDto,
        logo: {
          url: process.env.API_URL + '/' + path,
        },
      });
    }
  }

  @Post('updateProjectDetail/:id')
  @UseInterceptors(
    FileInterceptor('file', multerStorageConfig('detail_image/')),
  )
  async updateProjectDetail(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    // return this.uploadFileService.handleUpload(file);
    // uploads\project\โครงการลมเกาะใหญ่2345\web.facebook.com_98itstore-1700406817917-481307901.png

    if (!file) {
      if (updateProjectDto.file == 'undefined') {
        delete updateProjectDto.file;
        return this.projectService.updateProjectDetail(+id, {
          ...updateProjectDto,
          detail_image: null,
        });
      }
      return this.projectService.updateProjectDetail(+id, updateProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.projectService.updateProjectDetail(+id, {
        ...updateProjectDto,
        detail_image: {
          url: process.env.API_URL + '/' + path,
        },
      });
    }
  }

  @Post('updateProjectWindSpec/:id')
  @UseInterceptors(
    FileInterceptor('file', multerStorageConfig('wind_spec_image/')),
  )
  async updateProjectWindSpec(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    // return this.uploadFileService.handleUpload(file);
    // uploads\project\โครงการลมเกาะใหญ่2345\web.facebook.com_98itstore-1700406817917-481307901.png

    if (!file) {
      if (updateProjectDto.file == 'undefined') {
        delete updateProjectDto.file;
        return this.projectService.updateProjectWindSpec(+id, {
          ...updateProjectDto,
          wind_spec_image: null,
        });
      }
      return this.projectService.updateProjectWindSpec(+id, updateProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.projectService.updateProjectWindSpec(+id, {
        ...updateProjectDto,
        wind_spec_image: {
          url: process.env.API_URL + '/' + path,
        },
      });
    }
  }

  @Post('updateRawWind/:id')
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerStorageConfig('wind_potential/raw_wind_cost/'),
    ),
  )
  async updateRawWind(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    // return this.uploadFileService.handleUpload(file);
    // uploads\project\โครงการลมเกาะใหญ่2345\web.facebook.com_98itstore-1700406817917-481307901.png

    if (!file) {
      if (updateProjectDto.file == 'undefined') {
        delete updateProjectDto.file;
        return this.projectService.updateRawWind(+id, {
          ...updateProjectDto,
          detail_raw_wind_data: null,
        });
      }
      return this.projectService.updateRawWind(+id, updateProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.projectService.updateRawWind(+id, {
        ...updateProjectDto,
        detail_raw_wind_data: {
          url: process.env.API_URL + '/' + path,
          type: file.mimetype,
          filename: file.filename,
        },
      });
    }
  }

  @Post('updateSummaryWind/:id')
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerStorageConfig('wind_potential/summary_wind/'),
    ),
  )
  async updateSummaryWind(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    // return this.uploadFileService.handleUpload(file);
    // uploads\project\โครงการลมเกาะใหญ่2345\web.facebook.com_98itstore-1700406817917-481307901.png

    if (!file) {
      if (updateProjectDto.file == 'undefined') {
        delete updateProjectDto.file;
        return this.projectService.updateSummaryWind(+id, {
          ...updateProjectDto,
          detail_wind_summary: null,
        });
      }
      return this.projectService.updateSummaryWind(+id, updateProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.projectService.updateSummaryWind(+id, {
        ...updateProjectDto,
        detail_wind_summary: {
          url: process.env.API_URL + '/' + path,
          type: file.mimetype,
          filename: file.filename,
        },
      });
    }
  }

  @Post('updateInvestment/:id')
  @UseInterceptors(
    FileInterceptor('file', multerStorageConfig('wind_potential/investment/')),
  )
  async updateInvestment(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    // return this.uploadFileService.handleUpload(file);
    // uploads\project\โครงการลมเกาะใหญ่2345\web.facebook.com_98itstore-1700406817917-481307901.png
    if (!file) {
      if (updateProjectDto.file == 'undefined') {
        delete updateProjectDto.file;
        return this.projectService.updateInvestment(+id, {
          ...updateProjectDto,
          detail_investment: null,
        });
      }
      return this.projectService.updateInvestment(+id, updateProjectDto);
    } else {
      const path = file.path.split('\\').join('/');
      return this.projectService.updateInvestment(+id, {
        ...updateProjectDto,
        detail_investment: {
          url: process.env.API_URL + '/' + path,
          type: file.mimetype,
          filename: file.filename,
        },
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('getAllProject')
  findAllProject(@Req() request: Request) {
    const token = request.headers['authorization'];
    return this.projectService.findAllProject(token);
  }

  @UseGuards(AuthGuard)
  @Get('getAll')
  findAll() {
    return this.projectService.getAllProject();
  }

  @UseGuards(AuthGuard)
  @Get('getProjectByName/:name')
  getProjectByName(@Param('name') name: string) {
    return this.projectService.getProjectByName(name);
  }

  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectService.delete(+id);
  }

  @Delete('deleteMaps/:projectName')
  deleteMaps(@Param('projectName') projectName: string) {
    return this.projectService.deleteMaps(projectName);
  }
}
