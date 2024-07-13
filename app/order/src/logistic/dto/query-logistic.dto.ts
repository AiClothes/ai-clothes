import { IsNotEmpty } from 'class-validator';

export class QueryLogisticDto {
  // 基础分页
  current?: number;
  page_size?: number;

  name?: string;
}
