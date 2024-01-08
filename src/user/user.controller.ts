import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get('/getAllUsers')
  findAllUsers() {
    return this.userService.getAllUsersList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.deleteUser(+id);
    return { message: 'ลบข้อมูลเรียบร้อยแล้ว' };
  }
}
