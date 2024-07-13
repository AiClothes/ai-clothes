import { PartialType } from '@nestjs/mapped-types';
import { CreateCommonDto } from './create-common.dto';
import { IsNumber } from 'class-validator';

export class UpdateCommonDto extends PartialType(CreateCommonDto) {
  @IsNumber()
  id: number;
}
