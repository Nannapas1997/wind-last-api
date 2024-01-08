import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleService.create(createUserRoleDto);
  }

  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }

  @Get(':user_id/:role_id')
  findOne(
    @Param('user_id') user_id: string,
    @Param('role_id') role_id: string,
  ) {
    return this.userRoleService.findOne(+user_id, +role_id);
  }

  @Patch(':user_id/:role_id')
  update(
    @Param('user_id') user_id: string,
    @Param('role_id') role_id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userRoleService.update(+user_id, +role_id, updateUserRoleDto);
  }

  @Delete(':user_id/:role_id')
  remove(@Param('user_id') user_id: string, @Param('role_id') role_id: string) {
    return this.userRoleService.remove(+user_id, +role_id);
  }
}
