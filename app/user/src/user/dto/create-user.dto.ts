import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'email is required' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'nickname is required' })
  @IsString()
  nickname: string;

  @IsNotEmpty({ message: 'username is required' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'phone is required' })
  @IsString()
  phone: string;

  // @IsNotEmpty({ message: 'password is required' })
  password?: string;

  @IsArray()
  @IsInt({ each: true })
  role_ids?: number[];
}
