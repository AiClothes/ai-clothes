import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsUrl } from 'class-validator';
import { ProductImage } from './create-product.dto';

// 商品图片列表
export class CreateProductImageDto extends ProductImage {
  @IsNotEmpty({ message: 'product_id is required' })
  product_id: number;
}
