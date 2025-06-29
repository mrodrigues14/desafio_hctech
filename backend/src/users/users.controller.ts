import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(+id);
  }

  @Post()
  async create(@Body() createUserDto: { username: string; password: string }) {
    return await this.usersService.createUser(createUserDto.username, createUserDto.password);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: { username?: string; password?: string }
  ) {
    return await this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.deleteUser(+id);
  }
}
