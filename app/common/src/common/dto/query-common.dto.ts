import { IsNotEmpty } from 'class-validator';

export class QueryCommonDto {
  // 基础分页
  current?: number;
  page_size?: number;
}
