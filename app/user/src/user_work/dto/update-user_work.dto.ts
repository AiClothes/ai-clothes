import { PartialType } from '@nestjs/mapped-types';
import { CreateUserWorkDto } from './create-user_work.dto';
import { IsNumber } from 'class-validator';

export class UpdateUserWorkDto extends PartialType(CreateUserWorkDto) {
  @IsNumber()
  id: number;
}
