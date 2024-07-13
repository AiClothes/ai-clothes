import { PartialType } from '@nestjs/mapped-types';
import { CreateLogisticDto } from './create-logistic.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLogisticDto extends PartialType(CreateLogisticDto) {
  @IsNotEmpty({ message: 'id is required' })
  @IsNumber()
  id: number;
}
