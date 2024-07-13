import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class QueryOrderDto {
  // 基础分页
  @IsOptional()
  @IsNumber()
  current?: number;

  @IsOptional()
  @IsNumber()
  page_size?: number;

  @IsOptional()
  @IsString()
  order_no?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsEnum([0, 1, 2, 3, 4, 5, 6, 7, 100], {
    message: 'status must be 0 1 2 3 4 5 6 7 100'
  })
  status?: number;
}
