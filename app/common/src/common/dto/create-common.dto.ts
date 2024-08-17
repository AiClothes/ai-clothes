import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCommonDto {
  // 小程序公告 标题
  @IsOptional()
  @IsString()
  title?: string;
  // 小程序公告 子标题
  @IsOptional()
  @IsString()
  subtitle?: string;
  // 小程序公告 内容
  @IsOptional()
  @IsString()
  content?: string;
  // 小程序公告 图片
  @IsOptional()
  @IsUrl()
  image?: string;
}
