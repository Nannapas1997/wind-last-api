import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  constructor(private prisma: PrismaService) {}

  async createRole(data: CreateRoleDto) {
    const { role_name } = data;
    await this.prisma.role.findFirst({
      where: {
        role_name,
      },
    });

    if (role_name) {
      this.logger.warn(
        `ไม่สามารถสร้าง Role ด้วย Role Name('${role_name}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      throw new BadRequestException('มี Role Name นี้ในระบบแล้ว');
    }

    return this.prisma.role.create({
      data,
    });
  }

  async createRolePermission(data: any) {
    const { role_name, permissions } = data;

    const find = await this.prisma.role.findFirst({
      where: {
        role_name,
      },
    });

    if (find || !role_name) {
      this.logger.warn(
        `ไม่สามารถสร้าง Role ด้วย Role Name('${role_name}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      throw new BadRequestException('มี Role Name นี้ในระบบแล้ว');
    }

    const role = await this.prisma.role.create({
      data: {
        role_name,
      },
    });

    if (permissions.length > 0 && role) {
      await this.prisma.rolePermission.createMany({
        data: permissions.map((item) => {
          return {
            role_id: role.role_id,
            permission_id: item.permission_id,
            action: item.action,
          };
        }),
      });
    }

    return {
      message: 'success',
    };
  }

  getAllRoles() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  getAllRolesForManage() {
    return this.prisma.role.findMany();
  }

  getRoleById(role_id: number) {
    return this.prisma.role.findUnique({
      where: { role_id },
    });
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

      return {
        ...data,
        rolePermissions,
        projects,
      };
    } else {
      return [];
    }
  }

  async updateRole(role_id: number, data: UpdateRoleDto) {
    const { role_name } = data;
    const role = await this.prisma.role.findFirst({
      where: {
        role_name,
        NOT: {
          role_id,
        },
      },
    });

    if (role) {
      this.logger.warn(
        `ไม่สามารถแก้ไข Role ด้วย Role Name('${role_name}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      throw new BadRequestException('มี Role Name นี้ในระบบแล้ว');
    }

    return this.prisma.role.update({
      where: { role_id },
      data,
    });
  }

  deleteRole(role_id: number) {
    return this.prisma.role.delete({
      where: { role_id },
    });
  }

  async deleteRoleByRoleId(id: number) {
    const role = await this.prisma.userRole.findFirst({
      where: {
        role_id: id,
      },
    });

    if (!role) {
      await this.prisma.rolePermission.deleteMany({
        where: {
          role_id: id,
        },
      });

      await this.prisma.role.delete({
        where: { role_id: id },
      });
    } else {
      throw new BadRequestException(
        'ไม่สามารถลบ Role นี้ได้เนื่องจากมี User ใช้งานอยู่',
      );
    }

    return {
      message: 'success',
    };
  }
}
