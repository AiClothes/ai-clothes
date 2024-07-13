import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUrl
} from 'class-validator';
import { CreateProductSpecificationDto } from './create-product-specification.dto';

// 商品规格
export class UpdateProductSpecificationDto extends PartialType(
  CreateProductSpecificationDto
) {
  @IsNotEmpty({ message: 'id is required' })
  id: number;
}
