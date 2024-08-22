import { Inject, Injectable } from '@nestjs/common';
import { MICROSERVICE, OperateObjectType, OperateType } from '@one-server/core';
import { ClientProxy } from '@nestjs/microservices';
import { ContextService } from '../context/context.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  constructor(
    @Inject(MICROSERVICE.LOG_SERVICE) private logClient: ClientProxy,
    private readonly requestContextService: ContextService
  ) {}

  system_operate(data: CreateLogDto) {
    const {
      success,
      operate_type,
      operate_object_type,
      operate_object_id,
      operate_content,
      operate_result
    } = data;
    const request = this.requestContextService.getRequest();
    const { ip, method, url, user } = request || {};
    console.log('system_operate', ip, method, url, user, JSON.stringify(data));
    this.logClient.emit('system_operate_log_created', {
      operate_user: 1,
      operate_type: operate_type,
      operate_object_id: operate_object_id,
      operate_object_type: operate_object_type,
      operate_content: operate_content,
      operate_result: operate_result,
      operate_ip: ip,
      operate_success: success
    });
  }
}
