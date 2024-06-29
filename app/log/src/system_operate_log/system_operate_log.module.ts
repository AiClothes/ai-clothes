import { Module } from '@nestjs/common';
import { SystemOperateLogService } from './system_operate_log.service';
import { SystemOperateLogController } from './system_operate_log.controller';

@Module({
  controllers: [SystemOperateLogController],
  providers: [SystemOperateLogService],
})
export class SystemOperateLogModule {}
