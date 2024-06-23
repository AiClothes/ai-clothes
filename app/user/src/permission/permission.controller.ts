import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  ValidationPipe
} from '@nestjs/common';
import { BaseController } from '@one-server/core';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/PermissionDto';

@Controller('permission')
export class PermissionController extends BaseController<
  CreatePermissionDto,
  UpdatePermissionDto
> {
  constructor(private permission: PermissionService) {
    super(permission);
  }

  @Post('create')
  async create(@Body() data: CreatePermissionDto) {
    try {
      const r = await this.permission.create(data);
      return r;
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update')
  async update(@Body() data: UpdatePermissionDto) {
    try {
      const r = await this.permission.update(data);
      return r;
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // todo 其他权限相关操作
}
