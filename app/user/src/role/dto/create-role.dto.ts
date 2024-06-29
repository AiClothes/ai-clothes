import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}
