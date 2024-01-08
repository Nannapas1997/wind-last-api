import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return await this.rolePermissionService.create(createRolePermissionDto);
  }

  @Get()
  findAll() {
    return this.rolePermissionService.findAll();
  }

  @Get('/getRolePermissionByRoleId/:role_id')
  getRolePermissionByRoleId(@Param('role_id') role_id: string) {
    return this.rolePermissionService.getRolePermissionByRoleId(+role_id);
  }

  @Patch('/updateRolePermissionByRoleName/:role_name')
  updateRolePermissionByRoleName(
    @Param('role_name') role_name: string,
    @Body() body: any,
  ) {
    return this.rolePermissionService.updateRolePermissionByRoleName(
      role_name,
      body,
    );
  }

  @Get(':permission_id/:role_id')
  findOne(
    @Param('permission_id') permission_id: string,
    @Param('role_id') role_id: string,
  ) {
    return this.rolePermissionService.findOne(+permission_id, +role_id);
  }

  @Patch(':permission_id/:role_id')
  update(
    @Param('permission_id') permission_id: string,
    @Param('role_id') role_id: string,
    @Body() updateUserRoleDto: UpdateRolePermissionDto,
  ) {
    return this.rolePermissionService.update(
      +permission_id,
      +role_id,
      updateUserRoleDto,
    );
  }

  @Delete(':permission_id/:role_id')
  remove(
    @Param('permission_id') permission_id: string,
    @Param('role_id') role_id: string,
  ) {
    return this.rolePermissionService.remove(+permission_id, +role_id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rolePermissionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  // ) {
  //   return this.rolePermissionService.update(+id, updateRolePermissionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolePermissionService.remove(+id);
  // }
}
