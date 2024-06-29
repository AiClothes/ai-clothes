import { Controller, Post, Body, Param } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { SystemOperateLogService } from './system_operate_log.service';
import { CreateSystemOperateLogDto } from './dto/create-system_operate_log.dto';
import { UpdateSystemOperateLogDto } from './dto/update-system_operate_log.dto';
import { QuerySystemOperateLogDto } from './dto/query-system_operate_log.dto';

@Controller('system-operate-log')
export class SystemOperateLogController {
  constructor(
    private readonly systemOperateLogService: SystemOperateLogService
  ) {}

  // 特殊，微服务创建日志
  @EventPattern('system_operate_log_created')
  async create_event(data: CreateSystemOperateLogDto) {
    console.log(`system_operate_log_created`, data);
    return this.systemOperateLogService.create(data);
  }

  @Post('create')
  create(@Body() data: CreateSystemOperateLogDto) {
    return this.systemOperateLogService.create(data);
  }

  @Post('find-all')
  findAll(@Body() query: QuerySystemOperateLogDto) {
    return this.systemOperateLogService.findAll(query);
  }

  @Post('find-one')
  findOne(@Body('id') id: number) {
    return this.systemOperateLogService.findOne(id);
  }

  @Post('update')
  update(@Body() data: UpdateSystemOperateLogDto) {
    return this.systemOperateLogService.update(data);
  }

  @Post('remove')
  remove(@Body('id') id: number) {
    return this.systemOperateLogService.remove(id);
  }
}
