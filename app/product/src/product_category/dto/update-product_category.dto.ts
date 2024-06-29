import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCategoryDto } from './create-product_category.dto';
import { IsNotEmpty } from 'class-validator';

// PartialType() is a utility function that creates a new class that includes all the properties of the original class but makes them optional.
export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto
) {
  @IsNotEmpty({ message: 'id is required' })
  id: number;
}
