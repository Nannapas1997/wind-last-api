import { Injectable, Logger } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class RolePermissionService {
  private readonly logger = new Logger(RolePermissionService.name);
  constructor(private prisma: PrismaService) {}

  async create(createRolePermissionDto: CreateRolePermissionDto): Promise<any> {
    const { role_name, permissions } = createRolePermissionDto;
    // {
    //   "role_name": "test",
    //   "permissions": [
    //     {
    //       "permission_name": "a",
    //       "permission_type": "data"
    //     }
    //   ]
    // }

    const role = await this.prisma.role.upsert({
      where: {
        role_name,
      },
      update: {},
      create: {
        role_name,
      },
    });

    const create = await permissions.map(async (permission) => {
      const { permission_name, description, action } = permission;
      const res = await this.prisma.permission.upsert({
        where: {
          permission_name,
        },
        update: {
          permission_name,
          description,
        },
        create: {
          permission_name,
          description,
        },
      });

      await this.prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: role.role_id,
            permission_id: res.permission_id,
          },
        },
        update: {
          role_id: role.role_id,
          permission_id: res.permission_id,
          action: action,
        },
        create: {
          role_id: role.role_id,
          permission_id: res.permission_id,
          action: action,
        },
      });
    });

    await Promise.all(create);
    this.logger.log(
      `สร้าง Role(${role_name}) และ Permission(${permissions}) สำเร็จ`,
    );

    return await this.prisma.rolePermission.findMany({
      where: {
        role_id: role.role_id,
      },
      include: {
        role: true,
        permission: true,
      },
    });

    // await Promise.all(
    //   permissions.map(async (permission) => {
    //     const { permission_name, description } = permission;
    //     await this.prisma.permission.upsert({
    //       where: {
    //         permission_name,
    //       },
    //       update: {},
    //       create: {
    //         permission_name,
    //         description,
    //       },
    //     });
    //   }),
    // );

    // permissions.map(async (permission) => {
    //   await this.prisma.rolePermission.upsert({
    //     where: {
    //       role_id_permission_id: {
    //         role_id: role.role_id,
    //         permission_id: permission.permission_id,
    //       },
    //     },
    //     update: {},
    //     create: {
    //       role_id: role.role_id,
    //       permission_id: permission.permission_id,
    //     },
    //   });
    // });

    // return await this.prisma.rolePermission.findMany({
    //   where: {
    //     role_id: role.role_id,
    //   },
    //   include: {
    //     permission: true,
    //   },
    // });

    // const rolePermission = await this.prisma.rolePermission.findUnique({
    //   where: {
    //     role_id_permission_id: {
    //       role_id: createRolePermissionDto.role_id,
    //       permission_id: createRolePermissionDto.permission_id,
    //     },
    //   },
    // });

    // if (rolePermission) {
    //   this.logger.warn(
    //     `ไม่สามารถสร้าง RolePermission ด้วย Role ID('${createRolePermissionDto.role_id}') และ Permission ID('${createRolePermissionDto.permission_id}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
    //   );
    //   return rolePermission;
    // }

    // return await this.prisma.rolePermission.create({
    //   data: createRolePermissionDto,
    // });
  }

  async getRolePermissionByRoleId(role_id: number) {
    const rolePermission = await this.prisma.rolePermission.findMany({
      where: {
        role_id,
      },
      include: {
        role: true,
        permission: true,
      },
    });

    const permissionsList = await this.prisma.permission.findMany();

    // union
    const permissions = permissionsList.map((item) => {
      const find = rolePermission.find(
        (i) => i.permission_id === item.permission_id,
      );
      if (find) {
        return {
          id: item.permission_id,
          key: item.permission_id,
          permission: item.permission_name,
          action: find.action,
        };
      }

      return {
        id: item.permission_id,
        key: item.permission_id,
        permission: item.permission_name,
        action: null,
      };
    });

    return permissions;
  }

  async updateRolePermissionByRoleName(role_name: string, body: any) {
    const role = await this.prisma.role.findUnique({
      where: {
        role_name,
      },
    });

    if (role) {
      await this.prisma.rolePermission.deleteMany({
        where: {
          role_id: role.role_id,
        },
      });
    } else {
      this.logger.warn(
        `ไม่สามารถแก้ไข RolePermission ด้วย Role Name('${role_name}') นี้ได้เนื่องจากไม่มีอยู่ในระบบ`,
      );
    }

    // {
    //   permissions: [
    //     { permission_id: 1, action: 'edit' },
    //     { permission_id: 6, action: 'view' }
    //   ]
    // }

    const { permissions } = body;

    if (permissions.length > 0) {
      await Promise.all(
        permissions.map(async (permission) => {
          const { permission_id, action } = permission;
          await this.prisma.rolePermission.create({
            data: {
              role_id: role.role_id,
              permission_id,
              action,
            },
          });
        }),
      );
    }

    return {
      message: 'แก้ไข RolePermission สำเร็จ',
    };
  }

  async findAll() {
    return await this.prisma.rolePermission.findMany();
  }

  async findOne(permission_id: number, role_id: number) {
    return await this.prisma.rolePermission.findUnique({
      where: {
        role_id_permission_id: {
          role_id,
          permission_id: permission_id,
        },
      },
    });
  }

  async update(
    permission_id: number,
    role_id: number,
    data: UpdateRolePermissionDto,
  ) {
    const rolePermission = await this.findOne(permission_id, role_id);

    if (rolePermission) {
      this.logger.warn(
        `ไม่สามารถแก้ไข UserRole ด้วย User ID('${data.permission_id}') และ Role ID('${data.role_id}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      return rolePermission;
    }

    return this.prisma.rolePermission.update({
      where: {
        role_id_permission_id: {
          permission_id,
          role_id,
        },
      },
      data,
    });
  }

  async remove(permission_id: number, role_id: number) {
    return this.prisma.rolePermission.delete({
      where: {
        role_id_permission_id: {
          permission_id,
          role_id,
        },
      },
    });
  }

  // async findOne(user_id: number, role_id: number) {
  //   return await this.prisma.rolePermission.findUnique({
  //     where: {
  //       role_id_permission_id: {
  //         role_id,
  //         permission_id: user_id,
  //       },
  //     },
  //   });
  // }

  // async update(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
  //   const rolePermission = await this.prisma.rolePermission.findUnique({
  //     where: {
  //       role_id_permission_id: {
  //         role_id: updateRolePermissionDto.role_id,
  //         permission_id: updateRolePermissionDto.permission_id,
  //       },
  //     },
  //   });

  //   if (rolePermission) {
  //     this.logger.warn(
  //       `ไม่สามารถแก้ไข RolePermission ด้วย Role ID('${updateRolePermissionDto.role_id}') และ Permission ID('${updateRolePermissionDto.permission_id}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
  //     );
  //     return rolePermission;
  //   }

  //   return await this.prisma.rolePermission.update({
  //     where: {
  //       role_id_permission_id: {
  //         role_id: id,
  //         permission_id: updateRolePermissionDto.permission_id,
  //       },
  //     },
  //     data: updateRolePermissionDto,
  //   });
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} rolePermission`;
  // }
}
