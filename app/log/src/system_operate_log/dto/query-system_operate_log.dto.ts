import { IsNotEmpty } from 'class-validator';
import { OperateObjectType, OperateType } from '@one-server/core';

export class QuerySystemOperateLogDto {
  // 基础分页
  current?: number;
  page_size?: number;

  operate_type?: OperateType;
  operate_user?: number;
  operate_object_id?: number;
  operate_object_type?: OperateObjectType;
  operate_content?: string;
  operate_success?: boolean;
  operate_ip?: string;
}
