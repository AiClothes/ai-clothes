import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PermissionType } from '@one-server/core';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'permission_type is required' })
  @IsEnum(PermissionType)
  permission_type: PermissionType;
}
