import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Post('/createRolePermission')
  createRolePermission(@Body() body: any) {
    return this.roleService.createRolePermission(body);
  }

  @Get()
  findAll() {
    return this.roleService.getAllRoles();
  }

  @Get('getAllRoles')
  getAllRolesForManage() {
    return this.roleService.getAllRolesForManage();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.getRoleById(+id);
  }

  @Get('getPermissionByRoleName/:role_name')
  findOneByRoleName(@Param('role_name') role_name: string) {
    return this.roleService.getPermissionByRoleName(role_name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.deleteRole(+id);
  }

  @Delete('deleteByRoleId/:role_id')
  deleteRoleByRoleId(@Param('role_id') role_id: number) {
    return this.roleService.deleteRoleByRoleId(+role_id);
  }
}
