import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class OnlineWxUserDto {
  @IsNotEmpty({ message: '登陆信息获取失败！请检查当前微信账户' })
  @IsString()
  code: string;
}
