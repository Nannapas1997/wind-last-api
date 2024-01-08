import { Injectable } from '@nestjs/common';
import { CreateImageVideoDto } from './dto/create-image-video.dto';
import { UpdateImageVideoDto } from './dto/update-image-video.dto';
import { PrismaService } from 'src/prisma.service';
import { UploadFileService } from 'src/upload_file/upload_file.service';
import * as path from 'path';

@Injectable()
export class ImageVideoService {
  constructor(
    private prisma: PrismaService,
    private uploadFileService: UploadFileService,
  ) {}

  private filterObjectByKeys(keysToKeep: any[] = [], obj: any = {}) {
    const filteredObject = Object.keys(obj).reduce(
      (acc, key) => {
        if (keysToKeep.includes(key)) {
          acc[key] = obj[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return filteredObject;
  }

  async processImageData(
    createImageVideoDto: CreateImageVideoDto,
    file: any,
    targetFileColumn: string = 'image_video_file',
    targetFilterKeys: any[] = [],
  ) {
    let result = {};
    if (createImageVideoDto.input_file == '') {
      // ลบไฟล์เดิม
      result = {
        ...createImageVideoDto,
        [targetFileColumn]: [],
      };
    } else if (!file) {
      // ไม่มีการอัพไฟล์ใหม่
      result = createImageVideoDto;
    } else {
      // อัพไฟล์ใหม่
      const filePath = file.path.split(path.sep).join('/');
      const fileUrl = process.env.API_URL + '/' + filePath;

      result = {
        ...createImageVideoDto,
        [targetFileColumn]: [
          {
            url: fileUrl,
            type: file.mimetype,
            filename: file.filename,
          },
        ],
      };
    }

    return this.filterObjectByKeys(targetFilterKeys, result);
  }

  async create(createImageVideoDto: CreateImageVideoDto, file: any) {
    const filterKey = [
      'category',
      'description',
      'project_name',
      'type',
      'file',
    ];
    const processedData: any = await this.processImageData(
      createImageVideoDto,
      file,
      'file',
      filterKey,
    );

    await this.prisma.mediaProject.create({
      data: {
        ...processedData,
      },
    });
  }

  async findAllByProjectNameAndType(project_name: string, type: string) {
    const res = await this.prisma.mediaProject.findMany({
      where: {
        project_name: project_name,
        type: type,
      },
    });
    return res;
  }

  async update(
    id: number,
    updateImageVideoDto: CreateImageVideoDto,
    file: any,
  ) {
    const filterKey = [
      'category',
      'description',
      'project_name',
      'type',
      'file',
    ];
    const processedData: any = await this.processImageData(
      updateImageVideoDto,
      file,
      'file',
      filterKey,
    );
    await this.removeFileOld(id, processedData, 'file');
    await this.prisma.mediaProject.update({
      where: {
        id: id,
      },
      data: {
        ...processedData,
      },
    });
  }

  async remove(id: number) {
    const oldProject = await this.prisma.mediaProject.findUnique({
      where: {
        id: id,
      },
    });

    if (oldProject.file) {
      const oldImage: any = oldProject.file[0];
      if (oldImage?.url) {
        oldImage.url = oldImage?.url.replace(process.env.API_URL + '/', '');
        try {
          await this.uploadFileService.deleteFile(oldImage.url);
        } catch (error) {
          console.log(error);
        }
      }
    }

    return await this.prisma.mediaProject.delete({
      where: {
        id: id,
      },
    });
  }

  async removeFileOld(id: number, updateProjectDto: any, targetColumn: string) {
    if (updateProjectDto[targetColumn]) {
      const oldProject = await this.prisma.mediaProject.findUnique({
        where: {
          id: id,
        },
        select: {
          [targetColumn]: true,
        },
      });

      if (oldProject[targetColumn]) {
        const oldImage: any = oldProject[targetColumn][0];
        if (oldImage?.url) {
          oldImage.url = oldImage?.url.replace(process.env.API_URL + '/', '');
          try {
            await this.uploadFileService.deleteFile(oldImage.url);
          } catch (error) {
            console.log(error);
          }
        }
        // await this.uploadFileService.deleteFile(oldImage.url);
      }
    }
  }

  async findImageByProjectNameAndType(project_name: string, type: string) {
    const res = await this.prisma.mediaProject.findMany({
      where: {
        project_name: project_name,
        type: type,
      },
      select: {
        id: true,
        category: true,
        description: true,
        file: true,
      },
    });

    // split category
    const category = {};
    res.forEach((element) => {
      if (category[element.category]) {
        category[element.category].push(element);
      } else {
        category[element.category] = [element];
      }
    });

    return category;
  }
}
