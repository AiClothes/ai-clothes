import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLogisticDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
