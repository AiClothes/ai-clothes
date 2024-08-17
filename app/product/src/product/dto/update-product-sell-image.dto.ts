import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateProductSellImageDto } from './create-product-sell-image.dto';

// 其实这里要把分类什么的字段给过滤掉比较好，虽然没支持，但是传入不会报错
export class UpdateProductSellImageDto extends PartialType(
  CreateProductSellImageDto
) {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsBoolean()
  is_delete?: boolean;
}
