import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma.service';
import { UploadFileService } from 'src/upload_file/upload_file.service';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private uploadFileService: UploadFileService,
  ) {}
  // create(createDocumentDto: CreateDocumentDto) {
  //   return 'This action adds a new document';
  // }

  async create(createDocumentDto: CreateDocumentDto) {
    console.log(createDocumentDto);
    const {
      document_title,
      document_description,
      project_name,
      document_file,
    } = createDocumentDto;

    return await this.prisma.document.create({
      data: {
        document_title,
        document_description,
        project_name,
        document_file,
      },
    });
    // return await this.prisma.document.create({
    //   data: {
    //     document_title,
    //     document_file,
    //     document_description,
    //     project_name,
    //   },
    // });
    // return await this.prisma.document.create({
    //   data: createDocumentDto,
    // });
    // return await this.prisma.document.create({
    //   data: createDocumentDto,
    // });
  }

  async findAllByProjectName(project_name: string) {
    return await this.prisma.document.findMany({
      where: {
        project_name: project_name,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.document.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, createLeaseDetailDto: CreateDocumentDto) {
    const {
      document_title,
      document_description,
      project_name,
      document_file,
    } = createLeaseDetailDto;
    await this.removeFileOld(id, createLeaseDetailDto, 'document_file');
    try {
      const obj = {
        document_title,
        document_description,
        project_name,
        document_file: document_file ? document_file : undefined,
      };

      const res = await this.prisma.document.update({
        where: {
          id: id,
        },
        data: obj,
      });
      return res;
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }

  async remove(id: number) {
    const oldProject = await this.prisma.document.findUnique({
      where: {
        id: id,
      },
    });

    if (oldProject.document_file) {
      const oldImage: any = oldProject.document_file;
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

    return await this.prisma.document.delete({
      where: {
        id: id,
      },
    });
  }

  async removeFileOld(id: number, updateProjectDto: any, targetColumn: string) {
    if (updateProjectDto[targetColumn]) {
      const oldProject = await this.prisma.document.findUnique({
        where: {
          id: id,
        },
        select: {
          [targetColumn]: true,
        },
      });

      if (oldProject[targetColumn]) {
        const oldImage: any = oldProject[targetColumn];
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
}
