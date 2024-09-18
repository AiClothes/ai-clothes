import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Request
} from '@nestjs/common';
import { UserWorkService } from './user_work.service';
import { CreateUserWorkDto } from './dto/create-user_work.dto';
import { UpdateUserWorkDto } from './dto/update-user_work.dto';
import { QueryUserWorkDto } from './dto/query-user_work.dto';
import { WX } from '@one-server/core';

@Controller('user-work')
export class UserWorkController {
  constructor(private readonly userWorkService: UserWorkService) {}

  @WX()
  @Post('create')
  async create(@Body() data: CreateUserWorkDto, @Request() req) {
    try {
      const { user } = req;
      const { user_id, openid, ...reset } = user;
      return await this.userWorkService.create(data, user_id);
    } catch (e) {
      console.log('e', e);
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('update-work-images')
  async updateWorkImages(
    @Body() data: { work_id: number; url: string; front_type: number },
    @Request() req
  ) {
    try {
      const { user } = req;
      const { user_id, openid, ...reset } = user;
      return await this.userWorkService.updateWorkImages(data, user_id);
    } catch (e) {
      console.log('e', e);
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-all')
  async findAll(@Body() query: QueryUserWorkDto) {
    try {
      const count = await this.userWorkService.count(query);
      const list = await this.userWorkService.findAll(query);
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
      return await this.userWorkService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-one-width-ext')
  async findOneByUserId(
    @Body('user_id') user_id: number,
    @Body('product_id') product_id: number
  ) {
    try {
      return await this.userWorkService.findManyByExt(user_id, product_id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('update')
  async update(@Body() data: UpdateUserWorkDto) {
    try {
      return await this.userWorkService.update(data);
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
      return await this.userWorkService.remove(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('wx-my-works')
  async findMyWorks(@Request() req, @Body() query: QueryUserWorkDto) {
    try {
      const { user } = req;
      const { user_id, openid, ...reset } = user;
      const count = await this.userWorkService.countMyWorks(query, user_id);
      const list = await this.userWorkService.findMyWorks(query, user_id);
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

  @WX()
  @Post('wx-my-work-detail')
  async findMyWorkDetail(@Body('id') id: number) {
    try {
      return await this.userWorkService.findMyWorkDetail(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('count-works-type')
  async countWorksType(
    @Body('user_id') user_id: number,
    @Body('work_id') work_id: number
  ) {
    try {
      return await this.userWorkService.countWorksType();
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
