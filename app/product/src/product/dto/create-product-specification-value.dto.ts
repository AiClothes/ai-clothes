import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUrl
} from 'class-validator';
import {
  ProductSpecificationCombination,
  ProductSpecificationValue
} from './create-product.dto';

// 商品规格值
export class CreateProductSpecificationValueDto extends ProductSpecificationValue {
  @IsNotEmpty({ message: 'product_specification_id is required' })
  product_specification_id: number;

  // 非必填项
  @IsOptional()
  @IsArray()
  product_specification_combinations?: ProductSpecificationCombination[];
}
