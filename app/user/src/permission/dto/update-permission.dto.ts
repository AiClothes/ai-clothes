import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

// PartialType() is a utility function that creates a new class that includes all the properties of the original class but makes them optional.
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsNotEmpty({ message: 'id is required' })
  @IsInt()
  id: number;
}
