import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUrl
} from 'class-validator';
import {
  ProductSpecification,
  ProductSpecificationCombination
} from './create-product.dto';

// 商品规格
export class CreateProductSpecificationDto {
  @IsNotEmpty({ message: 'product_id is required' })
  product_id: number;

  @IsArray()
  product_specifications: ProductSpecification[];

  // 非必填项
  @IsOptional()
  @IsArray()
  product_specification_combinations?: ProductSpecificationCombination[];
}
