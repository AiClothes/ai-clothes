import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsUrl } from 'class-validator';
import { ProductImage, ProductSellLongImage } from './create-product.dto';

// 商品图片列表
export class CreateProductSellImageDto extends ProductSellLongImage {
  @IsNotEmpty({ message: 'product_id is required' })
  product_id: number;
}
