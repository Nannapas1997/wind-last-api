import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = await this.prisma.permission.findFirst({
      where: {
        permission_name: createPermissionDto.permission_name,
      },
    });

    if (permission) {
      this.logger.warn(
        `ไม่สามารถสร้าง Permission ด้วย Permission Name('${createPermissionDto.permission_name}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      throw new BadRequestException('มี Permission Name นี้ในระบบแล้ว');
    }

    return this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async findAll() {
    return await this.prisma.permission.findMany();
  }

  async getAllPermissionsForManage() {
    const permission = await this.prisma.permission.findMany();
    return permission.map((item) => {
      return {
        id: item.permission_id,
        key: item.permission_id,
        permission: item.permission_name,
        action: null,
      };
    });
  }

  async findOne(id: number) {
    return await this.prisma.permission.findUnique({
      where: { permission_id: id },
    });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = this.prisma.permission.findFirst({
      where: {
        permission_name: updatePermissionDto.permission_name,
        NOT: {
          permission_id: id,
        },
      },
    });

    if (permission) {
      this.logger.warn(
        `ไม่สามารถแก้ไข Permission ด้วย Permission Name('${updatePermissionDto.permission_name}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      throw new BadRequestException('มี Permission Name นี้ในระบบแล้ว');
    }

    await this.prisma.permission.update({
      where: { permission_id: id },
      data: updatePermissionDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.permission.delete({
      where: { permission_id: id },
    });
  }
}
