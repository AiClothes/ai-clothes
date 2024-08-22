import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// // 商品分类表
// model ProductCategory {
//   id Int @id @default(autoincrement())
//
//   // 分类名称
//   name String
//
//   // 多级分类
//   parent_id Int?
//   parent    ProductCategory?  @relation("ParentChild", fields: [parent_id], references: [id])
//   children  ProductCategory[] @relation("ParentChild")
//
//   // 商品信息
//   product Product[]
//
//   created_at DateTime  @default(now())
//   updated_at DateTime  @updatedAt
//   deleted_at DateTime?
//
//     @@map("product_categories")
// }

export class CreateProductCategoryDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  sort?: number;

  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsOptional()
  @IsNumber()
  is_virtual_goods?: number;
}
