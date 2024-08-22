import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { SecretKeyService } from './secret_key.service';
import { CreateSecretKeyDto } from './dto/create-secret_key.dto';
import { UpdateSecretKeyDto } from './dto/update-secret_key.dto';
import { QuerySecretKeyDto } from './dto/query-secret_key.dto';
import { WX } from '@one-server/core';

@Controller('secret-key')
export class SecretKeyController {
  constructor(private readonly secretKeyService: SecretKeyService) {}

  @Post('create')
  async create(@Body() data: CreateSecretKeyDto) {
    try {
      return await this.secretKeyService.create(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('create-batch')
  async createBatch(@Body() data: { batch: CreateSecretKeyDto[] }) {
    try {
      return await this.secretKeyService.createBatch(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-all')
  async findAll(@Body() query: QuerySecretKeyDto) {
    try {
      const list = await this.secretKeyService.findAll(query);
      const count = await this.secretKeyService.count(query);
      return { list, count };
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
      return await this.secretKeyService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update')
  async update(@Body() data: UpdateSecretKeyDto) {
    try {
      return await this.secretKeyService.update(data);
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
      return await this.secretKeyService.remove(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('use')
  async useKey(@Body() data: { key: string; user_id: number }) {
    try {
      return await this.secretKeyService.useKey(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
