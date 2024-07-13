import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProductSpecificationCombination } from './create-product.dto';

// 其实这里要把分类什么的字段给过滤掉比较好，虽然没支持，但是传入不会报错
export class UpdateProductSpecificationCombinationDto extends PartialType(
  ProductSpecificationCombination
) {
  @IsNotEmpty({ message: 'id is required' })
  id: number;
}
