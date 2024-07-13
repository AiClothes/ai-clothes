import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty } from 'class-validator';

// 其实这里要把分类什么的字段给过滤掉比较好，虽然没支持，但是传入不会报错
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty({ message: 'id is required' })
  id: number;
}
