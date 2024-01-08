import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { SharedService } from 'src/shared/shared.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private prisma: PrismaService,
    private sharedService: SharedService,
  ) {}

  async createUser(data: CreateUserDto): Promise<any> {
    // find username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data?.username }, { email: data?.email }],
      },
    });
    if (user) {
      this.logger.warn(
        `ไม่สามารถสร้าง Account ด้วย Email('${data?.email}') หรือ Username('${data?.username}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      throw new BadRequestException('มี username หรือ email นี้ในระบบแล้ว');
    }

    const hashedPassword = await this.sharedService.hashPassword(data.password);

    // if (!data.role) {
    //   data.role = 'user';
    // }

    const role_id = data?.role_id;
    if (data?.role_id) {
      delete data.role_id;
    }

    const account = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        etc: true,
      },
    });

    this.logger.log(`สร้าง Account สำเร็จ: ${account.username}`);

    if (role_id) {
      await this.prisma.userRole.create({
        data: {
          user_id: account.user_id,
          role_id: role_id,
        },
      });

      return {
        ...account,
        role: role_id,
      };
    }

    return {
      user_id: account.user_id,
    };
  }

  getAllUsers() {
    return this.prisma.user.findMany(
      {
        select: {
          user_id: true,
          username: true,
          email: true,
          etc: true,
        },
      },
      // {
      //   where: {
      //     username: {
      //       contains: 'admin',
      //     },
      //   },
      // },
    );
  }

  async getAllUsersList() {
    const user = await this.prisma.user.findMany({
      select: {
        user_id: true,
        username: true,
        email: true,
        etc: true,
        userRoles: {
          select: {
            role: {
              select: {
                role_id: true,
                role_name: true,
              },
            },
          },
        },
      },
    });

    return user.map((item) => {
      return {
        user_id: item.user_id,
        username: item.username,
        email: item.email,
        etc: item.etc,
        role: item.userRoles[0].role.role_name,
        role_id: item.userRoles[0].role.role_id,
      };
    });
  }

  getUserById(user_id: number) {
    return this.prisma.user.findUnique({
      where: { user_id },
      select: {
        user_id: true,
        username: true,
        email: true,
        etc: true,
      },
    });
  }

  async updateUser(
    user_id: number,
    data: UpdateUserDto,
  ): Promise<{
    user_id: number;
    username: string;
    email: string;
    etc: string;
  }> {
    // find username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data?.username }, { email: data?.email }],
        NOT: { user_id },
      },
    });
    if (user) {
      this.logger.warn(
        `ไม่สามารถแก้ไข Account ด้วย Email('${data?.email}') หรือ Username('${data?.username}') นี้ได้เนื่องจากมีอยู่ในระบบแล้ว`,
      );
      throw new BadRequestException('มี username หรือ email นี้ในระบบแล้ว');
    }

    if (data?.password) {
      data.password = await this.sharedService.hashPassword(data.password);
    }

    const role_id = data?.role_id;
    if (data?.role_id) {
      delete data.role_id;
    }
    await this.prisma.user.update({
      where: { user_id },
      data,
      select: {
        user_id: true,
        username: true,
        email: true,
        etc: true,
      },
    });

    if (role_id) {
      // const role = await this.prisma.role.upsert({
      //   where: {
      //     role_name: data.role,
      //   },
      //   update: {},
      //   create: {
      //     role_name: data.role,
      //   },
      // });
      await this.prisma.userRole.deleteMany({
        where: {
          user_id,
        },
      });

      await this.prisma.userRole.create({
        data: {
          user_id,
          role_id: role_id,
        },
      });
    }

    return await this.prisma.user.findUnique({
      where: { user_id },
      select: {
        user_id: true,
        username: true,
        email: true,
        etc: true,
      },
    });
  }

  async deleteUser(user_id: number) {
    return await this.prisma.user.delete({
      where: { user_id },
    });
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      this.logger.warn(
        `ไม่สามารถเข้าสู่ระบบด้วยชื่อผู้ใช้ ${username} หรือรหัสผ่านไม่ถูกต้อง`,
      );
      throw new BadRequestException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    const isPasswordMatch = await this.sharedService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      this.logger.warn(
        `ไม่สามารถเข้าสู่ระบบด้วยชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง`,
      );
      throw new BadRequestException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    delete user.password;

    const role = await this.prisma.userRole.findFirst({
      where: {
        user_id: user.user_id,
      },
      select: {
        role: {
          select: {
            role_name: true,
          },
        },
      },
    });

    this.logger.log(`เข้าสู่ระบบด้วยชื่อผู้ใช้: ${username}`);
    return {
      ...user,
      role: role.role.role_name,
    };
  }
}
