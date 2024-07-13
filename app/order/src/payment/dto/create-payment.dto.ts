import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
