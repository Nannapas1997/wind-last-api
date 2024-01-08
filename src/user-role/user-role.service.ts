import { Injectable, Logger } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserRoleDto) {
    const userRole = await this.prisma.userRole.findUnique({
      where: {
        user_id_role_id: {
          user_id: data.user_id,
          role_id: data.role_id,
        },
      },
    });

    if (userRole) {
      this.logger.warn(
        `ไม่สามารถสร้าง UserRole ด้วย User ID('${data.user_id}') และ Role ID('${data.role_id}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      return userRole;
    }

    return this.prisma.userRole.create({ data });
  }

  async findAll() {
    return this.prisma.userRole.findMany();
  }

  async findOne(user_id: number, role_id: number) {
    return this.prisma.userRole.findUnique({
      where: {
        user_id_role_id: {
          user_id,
          role_id,
        },
      },
    });
  }

  async update(user_id: number, role_id: number, data: UpdateUserRoleDto) {
    const userRole = await this.prisma.userRole.findUnique({
      where: {
        user_id_role_id: {
          user_id: data.user_id,
          role_id: data.role_id,
        },
      },
    });

    if (userRole) {
      this.logger.warn(
        `ไม่สามารถแก้ไข UserRole ด้วย User ID('${data.user_id}') และ Role ID('${data.role_id}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      return userRole;
    }

    return this.prisma.userRole.update({
      where: {
        user_id_role_id: {
          user_id,
          role_id,
        },
      },
      data,
    });
  }

  async remove(user_id: number, role_id: number) {
    return this.prisma.userRole.delete({
      where: {
        user_id_role_id: {
          user_id,
          role_id,
        },
      },
    });
  }
}
