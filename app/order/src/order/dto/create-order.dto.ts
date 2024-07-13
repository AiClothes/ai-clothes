import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

// // 订单表
// model Order {
//   id Int @id @default(autoincrement())
//
//   // 订单号 只要点了创建订单，就视为创建订单成功
//   order_no        String
//   // 用户ID
//   user_id         Int
//   // 订单状态 0: 待支付 1: 已支付 2: 已发货 3: 已签收 4: 已取消
//   status          Int
//   // 订单地址
//   address         String
//   // 订单收货人
//   consignee       String
//   // 订单收货人电话
//   consignee_phone String
//   // 订单备注
//   remark          String
//   // 订单支付时间
//   payment_time    DateTime?
//     // 订单发货时间
//     delivery_time   DateTime?
//       // 订单签收时间
//       sign_time       DateTime?
//         // 订单取消时间
//         cancel_time     DateTime?
//           // 订单完成时间
//           complete_time   DateTime?
//
//             // 支付方式
//             payment_id Int
//   payment    Payment @relation(fields: [payment_id], references: [id])
//
//   // 物流方式
//   logistic_id Int
//   logistic    Logistic @relation(fields: [logistic_id], references: [id])
//
//   // 订单商品
//   order_products OrderProduct[]
//
//   created_at DateTime  @default(now())
//   updated_at DateTime  @updatedAt
//   deleted_at DateTime?
//
//     @@map("orders")
// }
//
// // 订单商品表
// model OrderProduct {
//   id Int @id @default(autoincrement())
//
//   // 订单ID
//   order_id Int
//   Order    Order @relation(fields: [order_id], references: [id])
//
//   // 商品ID 微服务化，所以这里存储商品ID
//   product_id               Int
//   // 商品名称 为了防止商品信息变动，所以这里存储商品名称
//   product_name             String
//   // 规格值组合key [规格值id组合] 用,隔开
//   specification_value_id   String
//   // 商品规格值组合名称 用,隔开
//   specification_value_name String
//   // 商品价格(单价)原始
//   product_price            Float
//   // 商品总价 原始
//   product_total_price      Float
//
//   // 商品数量
//   product_num       Int
//   // 商品最终总价格 可能会有折扣/改价等操作
//   final_total_price Float
//
//   created_at DateTime  @default(now())
//   updated_at DateTime  @updatedAt
//   deleted_at DateTime?
//
//     @@map("order_products")
// }

export class Trades {
  // 交易凭证内容
  @IsNotEmpty({ message: 'trade_url is required' })
  @IsString()
  trade_url: string;
}

export class OrderProduct {
  // 商品ID 微服务化，所以这里存储商品ID
  @IsNotEmpty({ message: 'product_id is required' })
  @IsInt()
  product_id: number;

  // 商品名称 为了防止商品信息变动，所以这里存储商品名称
  @IsNotEmpty({ message: 'product_name is required' })
  @IsString()
  product_name: string;

  // 商品图片 为了防止商品信息变动，所以这里存储商品图片
  @IsNotEmpty({ message: 'product_image is required' })
  @IsString()
  product_image: string;

  // 商品规格值组合ID
  @IsNotEmpty({ message: 'specification_combination_id is required' })
  @IsNumber()
  specification_combination_id: number;

  // 商品数量
  @IsNotEmpty({ message: 'product_num is required' })
  @IsInt()
  product_num: number;

  // 商品最终总价格 可能会有折扣/改价等操作
  @IsOptional()
  @IsNumber()
  final_total_price?: number;
}

export class CreateOrderDto {
  // 订单号 前端传入，固定写死
  @IsNotEmpty({ message: 'order_no is required' })
  @IsString()
  // @IsUUID()
  order_no: string;

  // 用户ID
  @IsNotEmpty({ message: 'user_id is required' })
  @IsString()
  user_id: string;

  // 订单状态 0: 待支付 1: 已支付 2: 已发货 3: 已签收 4: 已取消 5: 已退货 6: 已退款 7: 已退货退款 100: 已完成
  @IsNotEmpty({ message: 'status is required' })
  @IsInt()
  @IsOptional()
  status?: number;

  // 订单地址
  @IsNotEmpty({ message: 'address is required' })
  @IsString()
  address: string;

  // 订单收货人
  @IsNotEmpty({ message: 'consignee is required' })
  @IsString()
  consignee: string;

  // 订单收货人电话
  @IsNotEmpty({ message: 'consignee_phone is required' })
  @IsString()
  consignee_phone: string;

  // 订单备注
  @IsNotEmpty({ message: 'remark is required' })
  @IsString()
  remark: string;

  // 订单支付时间
  @IsOptional()
  @IsDateString()
  payment_time?: Date;

  // 订单发货时间
  @IsOptional()
  @IsDateString()
  delivery_time?: Date;

  // 订单签收时间
  @IsOptional()
  @IsDateString()
  sign_time?: Date;

  // 订单取消时间
  @IsOptional()
  @IsDateString()
  cancel_time?: Date;

  // 取消原因
  @IsOptional()
  @IsString()
  cancel_reason?: string;

  // 订单完成时间
  @IsOptional()
  @IsDateString()
  complete_time?: Date;

  // 订单退款时间
  @IsOptional()
  @IsDateString()
  refund_time?: Date;

  // 订单退款原因
  @IsOptional()
  @IsString()
  refund_reason?: string;

  // 订单退货
  @IsOptional()
  @IsDateString()
  return_time?: Date;

  // 订单退货原因
  @IsOptional()
  @IsString()
  return_reason?: string;

  // 支付方式
  @IsNotEmpty({ message: 'payment_id is required' })
  @IsInt()
  payment_id: number;

  // 物流方式
  @IsNotEmpty({ message: 'logistic_id is required' })
  @IsInt()
  logistic_id: number;

  // 交易凭证
  @IsOptional()
  @IsArray()
  trades: Trades[];

  // 订单商品
  @IsNotEmpty({ message: 'order_products is required' })
  @IsArray()
  order_products: OrderProduct[];
}
