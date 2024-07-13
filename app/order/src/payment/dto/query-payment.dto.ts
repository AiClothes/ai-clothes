import { IsNotEmpty } from 'class-validator';

export class QueryPaymentDto {
  // 基础分页
  current?: number;
  page_size?: number;

  name?: string;
}
