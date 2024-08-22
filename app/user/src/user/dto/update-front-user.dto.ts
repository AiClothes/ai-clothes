import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFrontUserDto extends PartialType(CreateUserDto) {
  avatar?: string;
  address?: string;
  phone?: string;
  nickname?: string;
  gold?: number;
}
