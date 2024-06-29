import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemOperateLogDto } from './create-system_operate_log.dto';
import { IsNotEmpty } from 'class-validator';

// PartialType() is a utility function that creates a new class that includes all the properties of the original class but makes them optional.
export class UpdateSystemOperateLogDto extends PartialType(
  CreateSystemOperateLogDto
) {
  @IsNotEmpty({ message: 'id is required' })
  id: number;
}
