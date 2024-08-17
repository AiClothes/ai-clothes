import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Request
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { WX } from '@one-server/core';
import { UpdateFrontUserDto } from './dto/update-front-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() data: CreateUserDto) {
    try {
      return await this.userService.create(data);
    } catch (e) {
      console.log('e', e);
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-all')
  async findAll(@Body() query: QueryUserDto) {
    try {
      const count = await this.userService.count(query);
      const list = await this.userService.findAll(query);
      return {
        count: count,
        list: list
      };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-one')
  async findOne(@Body('id') id: number) {
    try {
      return await this.userService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update')
  async update(@Body() data: UpdateUserDto) {
    try {
      return await this.userService.update(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('remove')
  async remove(@Body('id') id: number) {
    try {
      return await this.userService.remove(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('bind-role')
  async bindRole(@Body() data: { role_id: number; user_id: number }) {
    try {
      return await this.userService.bindRole(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('unbind-role')
  async unbindRole(@Body() data: { role_id: number; user_id: number }) {
    try {
      return await this.userService.unbindRole(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 查询指定前端用户
  @Post('find-front-user')
  async findFrontUser(@Body('id') id: number) {
    try {
      return await this.userService.findFrontOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 查询前端用户列表
  @Post('find-front-all')
  async findFrontAll(@Body() query: QueryUserDto) {
    try {
      const count = await this.userService.countFront(query);
      const list = await this.userService.findFrontAll(query);
      return {
        count: count,
        list: list
      };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update-front-user')
  async updateFrontUser(
    @Body() data: UpdateFrontUserDto,
    @Body('openid') openid: string,
    @Body('user_id') user_id: number
  ) {
    try {
      return await this.userService.updateFrontUser(user_id, openid, data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('wx-update-front-user')
  async wxUpdateUser(@Body() data: UpdateFrontUserDto, @Request() req) {
    try {
      const { user } = req;
      const { user_id, openid, ...reset } = user;
      return await this.userService.updateFrontUser(user_id, openid, data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('wx-profile')
  async getProfile(@Body() data, @Request() req) {
    try {
      const { user } = req;
      const { user_id, openid, ...reset } = user;
      return await this.userService.findWXOne(user_id, openid);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
