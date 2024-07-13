import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class QueryProductDto {
  // 基础分页
  @IsOptional()
  @IsNumber()
  current?: number;

  @IsOptional()
  @IsNumber()
  page_size?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum([0, 1], { message: 'status must be 0 or 1' })
  status?: number;
}
