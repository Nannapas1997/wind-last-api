import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserRoleModule } from './user-role/user-role.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadFileModule } from './upload_file/upload_file.module';
import { join } from 'path';
import { LeaseDetailModule } from './lease-detail/lease-detail.module';
import { DocumentModule } from './document/document.module';
import { ImageVideoModule } from './image-video/image-video.module';
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    SharedModule,
    RoleModule,
    PermissionModule,
    UserRoleModule,
    RolePermissionModule,
    AuthModule,
    ProjectModule,
    UploadFileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    LeaseDetailModule,
    DocumentModule,
    ImageVideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
