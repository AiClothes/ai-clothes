import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryListDto {
  // swagger 文档用
  @ApiProperty({
    description: '当前页数',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number
  })
  // 验证是否是int
  @IsInt({ message: '当前页数必须为整数' })
  // 自动转换为数字类型
  @Type(() => Number)
  current: number;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    default: 10,
    minimum: 1,
    type: Number
  })
  @IsInt({ message: '每页数量必须为整数' })
  @Type(() => Number)
  page_size: number;
}

export class QueryCursorListDto {
  @ApiProperty({
    description: '游标 默认为id的游标',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number
  })
  @IsInt({ message: '固定游标必须是数据库的id，且为数字自增的内容查询' })
  @Type(() => Number)
  cursor: number | string;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    default: 10,
    minimum: 1,
    type: Number
  })
  @IsInt({ message: '每页数量必须为整数' })
  @Type(() => Number)
  page_size: number;
}

export class QueryDetailDto {
  @ApiProperty({
    description: 'id',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number
  })
  @IsInt({ message: '固定详情查询必须是数据库的id，且为数字自增的内容查询' })
  @Type(() => Number)
  id: number;
}
