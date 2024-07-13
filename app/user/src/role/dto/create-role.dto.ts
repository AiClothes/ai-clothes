import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
