import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator';

export class CreateSecretKeyDto {
  @ApiProperty({
    description: '秘钥的字符串',
    example: 'abc123XYZ!'
  })
  @IsString({ message: 'Key 必须是一个字符串' })
  @Length(5, 20, { message: 'Key 的长度必须在 5 到 20 个字符之间' })
  readonly key: string;

  @ApiProperty({
    description: '与秘钥关联的金币数量',
    example: 100
  })
  @IsInt({ message: 'Gold 必须是一个整数' })
  @Min(1, { message: 'Gold 最小值为 1' })
  @Max(10000, { message: 'Gold 最大值为 10000' })
  readonly gold: number;

  @ApiProperty({
    description: '是否已被消费，默认值为 false',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Consumed 必须是一个布尔值' })
  readonly consumed?: boolean = false;
}
