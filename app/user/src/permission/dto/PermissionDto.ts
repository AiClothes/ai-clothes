import { ApiProperty } from '@nestjs/swagger';
import { PermissionType } from '../enum/PermissionType';
import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
    default: ''
  })
  @IsNotEmpty({ message: '权限名称必填' })
  name: string;

  @ApiProperty({
    description: '权限类型',
    example: PermissionType.MENU,
    default: ''
  })
  @IsNotEmpty({ message: '权限类型必填' })
  permission_type: PermissionType;
}

export class UpdatePermissionDto {
  @ApiProperty({
    description: '权限ID',
    example: 1,
    default: 1
  })
  @IsNotEmpty({ message: '权限ID必填' })
  id: number;

  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
    default: ''
  })
  name?: string;

  @ApiProperty({
    description: '权限类型',
    example: PermissionType.MENU,
    default: ''
  })
  permission_type?: PermissionType;
}
