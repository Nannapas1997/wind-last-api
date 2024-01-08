import { Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SharedService } from 'src/shared/shared.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private readonly sharedService: SharedService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, ip: string) {
    const res = await this.userService.login(
      loginDto.username,
      loginDto.password,
    );

    if (res) {
      const access_token = this.sharedService.encrypt(
        JSON.stringify({
          username: res.username,
          user_id: res.user_id,
          email: res.email,
          role: res.role,
          ip,
        }),
      );
      return {
        token: await this.jwtService.signAsync({ access_token: access_token }),
      };
    } else {
      this.logger.warn('!!!ไม่พบข้อมูลผู้ใช้งาน');
    }
  }

  async validateToken(token: string) {
    try {
      const decrypted = this.sharedService.decrypt(token);
      const user = JSON.parse(decrypted);

      return user;
    } catch (error) {
      this.logger.warn(`Token ไม่ถูกต้อง ${token}`);
      return null;
    }
  }

  async decodeTokenJWT(token: string) {
    const decoded = await this.jwtService.verifyAsync(token);
    return decoded;
  }

  async getAccountInTokenJWT(token: string) {
    const access_token = await this.extractTokenFromHeader(token);
    const dataToken = await this.decodeTokenJWT(access_token);
    const data = await this.validateToken(dataToken.access_token);

    return data;
    // const user = await this.authService.validateToken(access_token);
  }

  private extractTokenFromHeader(token: string): string | undefined {
    const [type, access_token] = token.split(' ') ?? [];
    return type === 'Bearer' ? access_token : undefined;
  }

  async checkToken(token: string, projectName: string) {
    const dataToken = await this.decodeTokenJWT(token);
    // console.log(dataToken);
    const data = await this.validateToken(dataToken.access_token);

    if (!data) {
      return {
        status: 'Token ไม่ถูกต้อง',
      };
    }

    // check role permission
    const getRole = await this.prisma.role.findUnique({
      where: {
        role_name: data.role,
      },
    });

    const getRolePermission = await this.prisma.rolePermission.findMany({
      where: {
        role_id: getRole.role_id,
        permission: {
          permission_name: projectName,
        },
      },
    });

    if (getRolePermission.length > 0) {
      return {
        status: 'ผ่านการตรวจสอบ',
      };
    } else {
      return {
        status: 'ไม่มีสิทธิ์ในการเข้าถึง',
      };
    }
  }
}
