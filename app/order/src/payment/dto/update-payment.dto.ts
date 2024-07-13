import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsNotEmpty({ message: 'id is required' })
  @IsNumber()
  id: number;
}
