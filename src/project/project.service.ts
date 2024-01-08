import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma.service';
import { SharedService } from 'src/shared/shared.service';
import { AuthService } from 'src/auth/auth.service';
import { UploadFileService } from 'src/upload_file/upload_file.service';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private sharedService: SharedService,
    private authService: AuthService,
    private uploadFileService: UploadFileService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const res = await this.prisma.project.findFirst({
      where: {
        name: createProjectDto.name,
      },
    });

    if (res) {
      throw new BadRequestException('มี Role Name นี้ในระบบแล้ว');
    }

    const project = await this.prisma.project.create({
      data: createProjectDto,
    });

    await this.prisma.permission.create({
      data: {
        permission_name: project.name,
        description: 'project',
      },
    });

    return project;
  }

  async findAllProject(token: string) {
    const account = await this.authService.getAccountInTokenJWT(token);
    return await this.getPermissionByRoleName(account.role);
  }

  async getPermissionByRoleName(role_name: string) {
    const data = await this.prisma.role.findUnique({
      where: { role_name },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (data) {
      const rolePermissions = data.rolePermissions.map((item) => {
        return { ...item.permission, action: item.action };
      });

      const projects = {};
      rolePermissions
        .map((item) => {
          if (item.description === 'project') {
            projects[item.permission_name] = {
              title: item.permission_name,
              action: item?.action?.split('-'),
              type: item.description,
            };
          }
        })
        .filter((item) => item !== undefined);

      const projectList = await this.prisma.project.findMany({
        where: {
          name: {
            in: Object.keys(projects).map((item) => item),
          },
        },
      });

      Object.keys(projects).map((item) => {
        const project = projectList.find((project) => project.name === item);
        if (project) {
          projects[item].id = project.id;
          projects[item].logo = project.logo;
          projects[item].description = project.description;
          projects[item].detail_image = project.detail_image;
          projects[item].wind_spec_image = project.wind_spec_image;
        }
      });

      delete data.rolePermissions;
      return {
        ...data,
        projects,
      };
    } else {
      return [];
    }
  }

  async getAllProject() {
    const projectList = await this.prisma.project.findMany();

    return projectList || [];
  }

  async getProjectByName(name: string) {
    const projectList = await this.prisma.project.findFirst({
      where: {
        name: name,
      },
    });

    return projectList || null;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    if (updateProjectDto?.logo) {
      const oldProject = await this.prisma.project.findUnique({
        where: {
          id: id,
        },
        select: {
          logo: true,
        },
      });

      if (oldProject?.logo) {
        const oldImage: any = oldProject.logo;
        oldImage.url = oldImage.url.replace(process.env.API_URL + '/', '');
        try {
          await this.uploadFileService.deleteFile(oldImage.url);
        } catch (error) {
          console.log(error);
        }
        // await this.uploadFileService.deleteFile(oldImage.url);
      }
    }
    const check = await this.prisma.project.findFirst({
      where: {
        name: updateProjectDto.name,
        id: {
          not: id,
        },
      },
    });
    if (check) {
      throw new BadRequestException('มีชื่อโปรเจคนี้ในระบบแล้ว');
    }
    try {
      const res = await this.prisma.project.update({
        where: {
          id: id,
        },
        data: updateProjectDto,
      });

      return res;
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }

  async updateProjectDetail(id: number, updateProjectDto: UpdateProjectDto) {
    if (updateProjectDto?.detail_image) {
      const oldProject = await this.prisma.project.findUnique({
        where: {
          id: id,
        },
        select: {
          detail_image: true,
        },
      });

      if (oldProject?.detail_image) {
        const oldImage: any = oldProject.detail_image;
        oldImage.url = oldImage.url.replace(process.env.API_URL + '/', '');
        try {
          await this.uploadFileService.deleteFile(oldImage.url);
        } catch (error) {
          console.log(error);
        }
        // await this.uploadFileService.deleteFile(oldImage.url);
      }
    }
    try {
      const res = await this.prisma.project.update({
        where: {
          id: id,
        },
        data: updateProjectDto,
      });
      return res;
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }

  async updateProjectWindSpec(id: number, updateProjectDto: UpdateProjectDto) {
    if (updateProjectDto?.wind_spec_image) {
      const oldProject = await this.prisma.project.findUnique({
        where: {
          id: id,
        },
        select: {
          wind_spec_image: true,
        },
      });

      if (oldProject?.wind_spec_image) {
        const oldImage: any = oldProject.wind_spec_image;
        oldImage.url = oldImage.url.replace(process.env.API_URL + '/', '');
        try {
          await this.uploadFileService.deleteFile(oldImage.url);
        } catch (error) {
          console.log(error);
        }
        // await this.uploadFileService.deleteFile(oldImage.url);
      }
    }
    try {
      const res = await this.prisma.project.update({
        where: {
          id: id,
        },
        data: updateProjectDto,
      });
      return res;
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }

  async updateRawWind(id: number, updateProjectDto: UpdateProjectDto) {
    await this.removeFileOld(id, updateProjectDto, 'detail_raw_wind_data');
    try {
      const res = await this.prisma.project.update({
        where: {
          id: id,
        },
        data: updateProjectDto,
      });
      return res;
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }

  async updateSummaryWind(id: number, updateProjectDto: UpdateProjectDto) {
    await this.removeFileOld(id, updateProjectDto, 'detail_wind_summary');
    try {
      const res = await this.prisma.project.update({
        where: {
          id: id,
        },
        data: updateProjectDto,
      });
      return res;
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }
  async updateInvestment(id: number, updateProjectDto: UpdateProjectDto) {
    await this.removeFileOld(id, updateProjectDto, 'detail_investment');
    try {
      const res = await this.prisma.project.update({
        where: {
          id: id,
        },
        data: updateProjectDto,
      });
      return res;
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }

  async removeFileOld(id: number, updateProjectDto: any, targetColumn: string) {
    if (updateProjectDto[targetColumn]) {
      const oldProject = await this.prisma.project.findUnique({
        where: {
          id: id,
        },
        select: {
          [targetColumn]: true,
        },
      });

      if (oldProject[targetColumn]) {
        const oldImage: any = oldProject[targetColumn];
        oldImage.url = oldImage.url.replace(process.env.API_URL + '/', '');
        try {
          await this.uploadFileService.deleteFile(oldImage.url);
        } catch (error) {
          console.log(error);
        }
        // await this.uploadFileService.deleteFile(oldImage.url);
      }
    }
  }

  async removeFileOldNotCheck(id: number, targetColumn: string[]) {
    const oldProject = await this.prisma.project.findUnique({
      where: {
        id: id,
      },
    });

    await targetColumn.forEach(async (item) => {
      if (oldProject[item]) {
        const oldImage: any = oldProject[item];
        oldImage.url = oldImage.url.replace(process.env.API_URL + '/', '');
        try {
          await this.uploadFileService.deleteFile(oldImage.url);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async getMapsData(projectName: string) {
    const project = await this.prisma.mapsProject.findFirst({
      where: {
        project_name: projectName,
      },
    });

    if (!project) {
      return {
        status: 'not found',
      };
    }

    const projectDetail = await this.prisma.mapsProjectDetail.findMany({
      where: {
        project_name: projectName,
      },
    });

    const projectData = await this.prisma.mapsProject.findFirst({
      where: {
        project_name: projectName,
      },
    });

    return {
      status: 'success',
      ...projectData,
      paths: projectDetail,
    };
  }

  async createMapsData(projectName: string, url: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        name: projectName,
      },
    });

    if (!project) {
      throw new BadRequestException('ไม่พบโปรเจคนี้ในระบบ');
    }

    try {
      await this.prisma.mapsProject.create({
        data: {
          project_name: projectName,
          mapsUrl: url,
        },
      });
    } catch (error) {
      console.log('มีข้อมูลแล้ว');
    }

    console.log('createMapsData/' + projectName);

    return {
      status: 'success',
    };
  }

  async createPath(data: any, projectName: string) {
    await this.prisma.$transaction(async (tx) => {
      try {
        await tx.mapsProjectDetail.createMany({
          data: data.paths.map((item) => {
            try {
              delete item.id;
            } catch (error) {}
            return {
              path_type: 'ขอบเขตที่ดิน',
              path: item,
              project_name: projectName,
            };
          }),
        });
        console.log('create path success');
        return {
          status: 'success',
        };
      } catch (error) {
        console.log(error);
        throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    });
  }

  async deletePath(id: number) {
    await this.prisma.$transaction(async (tx) => {
      try {
        await tx.mapsProjectDetail.delete({
          where: {
            id: parseInt(id.toString()),
          },
        });
        console.log('delete path success');
        return {
          status: 'success',
        };
      } catch (error) {
        throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    });

    return {
      status: 'success',
    };
  }

  async createPathMutiple(data: any, projectName: string) {
    await this.prisma.$transaction(async (tx) => {
      try {
        if (data.path_type != 'จุดติดตั้งกังหันลม') {
          await tx.mapsProjectDetail.createMany({
            data: data.newPaths.map((item) => {
              try {
                delete item.id;
              } catch (error) {}
              return {
                path: item,
                project_name: projectName,
                path_type: data.path_type,
                category: data.category,
              };
            }),
          });
        } else {
          await tx.mapsProjectDetail.createMany({
            data: data.newPaths.map((item) => {
              try {
                delete item.id;
              } catch (error) {}
              return {
                path: item,
                project_name: projectName,
                path_type: data.path_type,
                children: data.children,
              };
            }),
          });
        }
        console.log('create path success');
        return {
          status: 'success',
        };
      } catch (error) {
        console.log(error);
        throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    });
  }

  async createMapsDataDetail(projectName: string, data: any) {
    const project = await this.prisma.mapsProject.findFirst({
      where: {
        project_name: projectName,
      },
    });

    if (!project) {
      throw new BadRequestException('ไม่พบโปรเจคนี้ในระบบ');
    }

    await this.prisma.mapsProject.update({
      where: {
        id: project.id,
      },
      data: {
        width: data.width,
        height: data.height,
        originalHeight: data.originalHeight,
        originalWidth: data.originalWidth,
        transform: data.transform,
      },
    });

    // update path
    return await this.createPath(data, projectName);
  }

  async updateMapsDetail(data: any) {
    if (data?.path_type == 'จุดติดตั้งกังหันลม') {
      data.children = {
        turbine_name: data.turbine_name,
        turbine_type: data.turbine_type,
        group_area: [],
      };
      data.lease_id = data?.lease_id?.toString();

      delete data.turbine_name;
      delete data.turbine_type;
    }
    return await this.prisma.mapsProjectDetail.update({
      where: {
        id: data.id,
      },
      data: data,
    });
  }

  async updateMultiplePath(project_name, data) {
    try {
      delete data.newImages;
    } catch (error) {}

    if (data?.path_type == 'จุดติดตั้งกังหันลม') {
      data.children = {
        turbine_name: data.turbine_name,
        turbine_type: data.turbine_type,
        group_area: [],
      };

      try {
        delete data.turbine_name;
        delete data.turbine_type;
      } catch (error) {}
    }

    await this.createPathMutiple(data, project_name);
  }

  async deleteMaps(projectName: string) {
    return await this.prisma.$transaction(async (tx) => {
      try {
        const project = await tx.mapsProject.findFirst({
          where: {
            project_name: projectName,
          },
        });

        // delete image from url
        try {
          await this.deleteImageFromUrl(project.mapsUrl);
          await this.deleteImageFromUrl(project.cityPlanUrl);
          await this.deleteImageFromUrl(project.spacialAreaUrl);
        } catch (error) {
          console.log('can not delete image from url');
        }

        await tx.mapsProjectDetail.deleteMany({
          where: {
            project_name: projectName,
          },
        });

        await tx.mapsProject.delete({
          where: {
            project_name: projectName,
          },
        });
        console.log('delete maps success');
        return {
          status: 'success',
        };
      } catch (error) {
        throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    });
  }

  async updateArea(project_name: string, data: any) {
    let update_mode = null;
    if (data?.turbine_name) {
      update_mode = 'จุดติดตั้งกังหันลม';
    } else if (data?.catagory) {
      update_mode = 'โครงการย่อย';
    }

    if (!update_mode) {
      throw new BadRequestException('ไม่พบโหมดการอัพเดท');
    }

    if (update_mode === 'โครงการย่อย') {
      // { catagory: 'asd', ids: [ 117, 119, 118, 83, 120, 121 ] }
      return await this.prisma.$transaction(async (tx) => {
        try {
          await tx.mapsProjectDetail.updateMany({
            where: {
              id: {
                in: data.ids,
              },
            },
            data: {
              category: data.catagory,
            },
          });
          console.log('update area success');
          return {
            status: 'success',
          };
        } catch (error) {
          console.log(error);
          throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }
      });
    } else if (update_mode === 'จุดติดตั้งกังหันลม') {
      // { turbine_name: 'b', id: 175, ids: [ 119, 117, 120, 121 ] }
      return await this.prisma.$transaction(async (tx) => {
        try {
          const oldData = await tx.mapsProjectDetail.findFirst({
            where: {
              id: data.id,
            },
            select: {
              children: true,
            },
          });

          const newChildren = {
            turbine_name: data.turbine_name,
            turbine_type: oldData.children['turbine_type'],
            group_area: [
              ...new Set([...oldData.children['group_area'], ...data.ids]),
            ],
          };

          await tx.mapsProjectDetail.update({
            where: {
              id: data.id,
            },
            data: {
              children: newChildren,
            },
          });
          console.log('update area success');
          return {
            status: 'success',
          };
        } catch (error) {
          console.log(error);
          throw new BadRequestException('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }
      });
    }
  }

  async getRadiusTurbine(projectName: string) {
    const res = await this.prisma.mapsProjectDetail.findMany({
      where: {
        project_name: projectName,
        path_type: 'จุดติดตั้งกังหันลม',
      },
      select: {
        id: true,
        category: true,
        children: true,
        latitude: true,
        longitude: true,
      },
    });

    const newData = {};
    for (const item of res) {
      if (!newData[item?.children['turbine_name']]) {
        newData[item?.children['turbine_name']] = [];
      }
      newData[item?.children['turbine_name']].push({
        id: item.id,
        turbine_type: item.children['turbine_type'],
      });
    }

    return newData;
  }

  async getCategory(projectName: string) {
    const res = await this.prisma.mapsProjectDetail.findMany({
      where: {
        project_name: projectName,
        category: {
          not: null,
        },
      },
    });

    const newData = {};
    for (const item of res) {
      if (!newData[item?.category]) {
        newData[item?.category] = [];
      }
      newData[item?.category].push(item.id);
    }

    return newData;
  }

  async delete(id: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
      },
    });

    if (!project) {
      throw new BadRequestException('ไม่พบโปรเจคนี้ในระบบ');
    }
    const pathFolder = 'uploads/project/' + project.name;
    await this.uploadFileService.moveFolder(
      pathFolder,
      'uploads/trash/' + project.name + '_' + Date.now(),
    );

    const result = await this.prisma.project.delete({
      where: {
        id: id,
      },
    });

    try {
      const permission = await this.prisma.permission.findUnique({
        where: {
          permission_name: project.name,
        },
        select: {
          permission_id: true,
        },
      });

      await this.prisma.rolePermission.deleteMany({
        where: {
          permission_id: permission.permission_id,
        },
      });

      await this.prisma.permission.delete({
        where: {
          permission_name: project.name,
        },
        select: {
          permission_id: true,
        },
      });

      console.log(permission.permission_id);

      console.log('permission found');
    } catch (error) {
      console.log('permission not found');
    }

    return result;
  }

  async deleteImageFromUrl(url: string) {
    const oldImage: any = url;
    oldImage.url = oldImage.url.replace(process.env.API_URL + '/', '');
    try {
      await this.uploadFileService.deleteFile(oldImage.url);
    } catch (error) {
      console.log("can't delete file from url " + url);
    }
  }

  
}
