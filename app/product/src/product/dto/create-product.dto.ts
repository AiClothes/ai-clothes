import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';

// 商品图片列表
export class ProductImage {
  @IsNotEmpty({ message: 'url is required' })
  @IsUrl()
  url: string;

  @IsNotEmpty({ message: 'is_main is required' })
  @IsBoolean()
  is_main: boolean;
}

export class ProductSellLongImage {
  @IsNotEmpty({ message: 'url is required' })
  @IsUrl()
  url: string;

  @IsNotEmpty({ message: 'sort is required' })
  @IsInt()
  sort: number;
}

// 商品规格值
export class ProductSpecificationValue {
  @IsNotEmpty({ message: 'value is required' })
  @IsString()
  value: string;
}

// 商品规格
export class ProductSpecification {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'value is required' })
  @IsArray()
  product_specification_values: ProductSpecificationValue[];
}

// 商品规格组合
export class ProductSpecificationCombination {
  @IsNotEmpty({ message: 'quantity is required' })
  @IsNumber()
  quantity: number;

  // 非必填项
  @IsOptional()
  @IsUrl()
  image?: string;

  // 非必填项
  @IsOptional()
  @IsUrl()
  draw_image?: string;

  // 非必填项
  @IsOptional()
  @IsUrl()
  draw_image_back?: string;

  // 非必填项
  @IsOptional()
  @IsNumber()
  price?: number;

  // 非必填项
  @IsOptional()
  @IsInt()
  status?: number;

  @IsNotEmpty({ message: 'specification_values is required' })
  @IsString({ each: true })
  specification_values: string[];
}

// 创建商品
export class CreateProductDto {
  @IsNotEmpty({ message: 'category_id is required' })
  @IsInt()
  category_id: number;

  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  price: number;

  // 非必填项
  @IsOptional()
  @IsNumber()
  quantity?: number;

  // 非必填项
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'unit is required' })
  @IsString()
  unit: string;

  // 非必填项
  @IsOptional()
  @IsInt()
  status?: number;

  // 非必填项
  @IsOptional()
  @IsInt()
  sort?: number;

  // 非必填项
  @IsOptional()
  @IsNumber()
  pay_account?: number;

  // 非必填项
  @IsOptional()
  @IsString()
  pay_account2?: string;

  // 由程序自动处理
  // @IsNotEmpty({ message: 'image is required' })
  // @IsUrl()
  // image?: string;

  @IsNotEmpty({ message: 'product_images is required' })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one product_images is required' })
  product_images: ProductImage[];

  @IsArray()
  @IsOptional()
  product_sell_long_images?: ProductSellLongImage[];

  // 非必填项
  @IsOptional()
  @IsArray()
  product_specifications?: ProductSpecification[];

  // 非必填项
  @IsOptional()
  @IsArray()
  product_specification_combinations?: ProductSpecificationCombination[];
}
