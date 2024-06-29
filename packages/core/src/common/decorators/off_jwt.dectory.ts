import { SetMetadata } from '@nestjs/common';

export const IS_OFF_JWT = 'is_off_jwt';
export const OFF_JWT = () => SetMetadata(IS_OFF_JWT, true);
