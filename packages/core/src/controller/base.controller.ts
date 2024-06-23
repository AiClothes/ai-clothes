import {
  Body,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query
} from '@nestjs/common';
import { QueryCursorListDto, QueryDetailDto, QueryListDto } from '../dto';

export class BaseController<CreateDTO, UpdateDTO> {
  service: any;

  constructor(service: any) {
    this.service = service;
  }

  @Get('list')
  async list(@Query() query: QueryListDto) {
    const { current, page_size } = query;
    const list = await this.service.list({
      current,
      page_size
    });
    const count = await this.service.count();
    return {
      list: list,
      count: count
    };
  }

  @Get('cursor_list')
  async cursor_list(@Query() query: QueryCursorListDto) {
    const { cursor, page_size } = query;
    const list = await this.service.cursor_list({
      cursor,
      page_size
    });
    return {
      list: list
    };
  }

  @Get('count')
  async count() {
    const count = await this.service.count();
    return {
      count: count
    };
  }

  @Get('detail')
  async detail(@Query() query: QueryDetailDto) {
    const detail = await this.service.detail({
      id: query.id
    });
    return {
      detail: detail
    };
  }

  // 写在这里，检测的DTO会读取不到，所以还是在外面比较好，同时try catch的异常，很难抛出来 create 和 update都一样，可能是BUG
  @Post('create')
  async create(@Body() data: CreateDTO) {
    try {
      const r = await this.service.create(data);
      return r;
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update')
  async update(@Body() data: UpdateDTO) {
    try {
      const r = await this.service.update(data);
      return r;
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
