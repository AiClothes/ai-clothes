import { PartialType } from '@nestjs/mapped-types';
import { CreateSecretKeyDto } from './create-secret_key.dto';

export class UpdateSecretKeyDto extends PartialType(CreateSecretKeyDto) {
  id: number;
}
