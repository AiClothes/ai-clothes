import { WorkCreateType } from '../../common/enum/WorkCreateType';
import { WorkType } from '../../common/enum/WorkType';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';

export class CreateUserWorkImages {
  @IsInt()
  work_id: number;

  @IsUrl()
  url: string;
}

export class CreateUserWorkDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  cover?: string | null;

  @IsUrl()
  content: string;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsString()
  info?: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @IsOptional()
  @IsBoolean()
  is_collect?: boolean;

  source: WorkType;

  create_type: WorkCreateType;

  @IsOptional()
  @IsBoolean()
  is_delete?: boolean;

  @IsOptional()
  @IsNumber()
  product_id?: number;

  @IsOptional()
  @IsArray()
  images: CreateUserWorkImages[];

  @IsOptional()
  @IsInt()
  create_parent_id?: number;
}
