import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { CommonService } from './common.service';
import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';
import { QueryCommonDto } from './dto/query-common.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { GeneralSegmentDto } from './dto/general-segment.dto';
import { AIDrawDto } from './dto/ai-draw.dto';
import { WX } from '@one-server/core';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('create')
  async create(@Body() data: CreateCommonDto) {
    try {
      return await this.commonService.create(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-all')
  async findAll(@Body() query: QueryCommonDto) {
    try {
      const count = await this.commonService.count(query);
      const list = await this.commonService.findAll(query);
      return { count, list };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-tree')
  async findTree(@Body() query: object) {
    try {
      return await this.commonService.findTree(query);
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
      return await this.commonService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update')
  async update(@Body() data: UpdateCommonDto) {
    try {
      return await this.commonService.update(data);
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
      return await this.commonService.remove(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 查询上传图片的token【后台用】
  @Post('upload')
  async upload(@Body() data: UploadFileDto) {
    try {
      return await this.commonService.upload({});
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 查询上传图片的token【前端用】
  @WX()
  @Post('upload-user-file')
  async uploadUserFile(@Body() data: UploadFileDto) {
    try {
      return await this.commonService.upload({
        allowPrefix: 'user/*'
      });
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 接入第三方的api 抠图
  @WX()
  @Post('ai-cut')
  async aiCut(@Body() data: GeneralSegmentDto) {
    try {
      return await this.commonService.aiCut(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //  AI绘图 API 腾讯官方原版
  @WX()
  @Post('ai-draw')
  async aiDraw(@Body() data: AIDrawDto) {
    try {
      return await this.commonService.aiDraw(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
