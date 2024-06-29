import { IsNotEmpty } from 'class-validator';
import { OperateObjectType, OperateType } from '@one-server/core';

export class CreateLogDto {
  success: boolean;
  operate_type: OperateType;
  operate_object_type: OperateObjectType;
  operate_object_id: number;
  operate_content: string;
  operate_result: string;
}
