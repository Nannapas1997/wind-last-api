import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaseDetailDto } from './dto/create-lease-detail.dto';
import { UpdateLeaseDetailDto } from './dto/update-lease-detail.dto';
import { PrismaService } from 'src/prisma.service';
import { UploadFileService } from 'src/upload_file/upload_file.service';

@Injectable()
export class LeaseDetailService {
  constructor(
    private prisma: PrismaService,
    private uploadFileService: UploadFileService,
  ) {}
  async create(createLeaseDetailDto: CreateLeaseDetailDto) {
    return await this.prisma.leaseDetail.create({
      data: createLeaseDetailDto,
    });
  }

  async findAllByProjectName(project_name: string) {
    return await this.prisma.leaseDetail.findMany({
      where: {
        projectName: project_name,
      },
    });
  }

  async findLeaseByWindName(project_name, wind_name) {
    const res = await this.prisma.mapsProjectDetail.findMany({
      where: {
        project_name: project_name,
        path_type: 'จุดติดตั้งกังหันลม',
      },
    });

    const result = await res.filter((element) => {
      return element?.children['turbine_name'] == wind_name;
    });

    const newResult = {};
    await result.map((element) => {
      newResult[element?.children['turbine_type']] =
        element?.children['group_area'];
    });

    const allLeastId = {};

    const resultKeys = Object.keys(newResult);

    for (const element of resultKeys) {
      const obj = await this.prisma.mapsProjectDetail.findMany({
        where: {
          id: {
            in: Object.values(newResult[element]),
          },
          lease_id: {
            not: null,
          },
        },
        select: {
          id: true,
          lease_id: true,
        },
      });

      const obj2 = [];
      for (const item of obj) {
        const resLease = await this.prisma.leaseDetail.findFirst({
          where: {
            id: parseInt(item?.lease_id),
          },
        });

        obj2.push(resLease);
      }
      allLeastId[element.toString()] = obj2;
    }

    

    return allLeastId;
  }

  async findOne(id: number) {
    return await this.prisma.leaseDetail.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, createLeaseDetailDto: CreateLeaseDetailDto) {
    await this.removeFileOld(id, createLeaseDetailDto, 'download');
    try {
      const res = await this.prisma.leaseDetail.update({
        where: {
          id: id,
        },
        data: createLeaseDetailDto,
      });
      return res;
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }

  async remove(id: number) {
    const oldProject = await this.prisma.leaseDetail.findUnique({
      where: {
        id: id,
      },
    });

    if (oldProject.download) {
      const oldImage: any = oldProject.download;
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

    return await this.prisma.leaseDetail.delete({
      where: {
        id: id,
      },
    });
  }

  async removeFileOld(id: number, updateProjectDto: any, targetColumn: string) {
    if (updateProjectDto[targetColumn]) {
      const oldProject = await this.prisma.leaseDetail.findUnique({
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
