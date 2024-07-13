import { IsOptional, IsString, IsUrl } from 'class-validator';

export class GeneralSegmentDto {
  @IsUrl()
  image_url: string;
}
