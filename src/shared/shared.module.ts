import { Module, Global } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SharedService } from './shared.service';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [PrismaService, SharedService, JwtService],
  exports: [PrismaService, SharedService, JwtService],
})
export class SharedModule {}
