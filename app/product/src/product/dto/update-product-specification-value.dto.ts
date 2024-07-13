import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUrl
} from 'class-validator';
import { CreateProductSpecificationValueDto } from './create-product-specification-value.dto';

// 商品规格值
export class UpdateProductSpecificationValueDto extends PartialType(
  CreateProductSpecificationValueDto
) {
  @IsNotEmpty({ message: 'id is required' })
  id: number;
}
