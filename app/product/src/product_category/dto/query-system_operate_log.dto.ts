import { IsNotEmpty } from 'class-validator';

export class QueryProductCategoryDto {
  // 基础分页
  current?: number;
  page_size?: number;

  name?: string;
  parent_id?: number;
  is_virtual_goods?: number[];
}
