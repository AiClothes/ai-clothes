import { SetMetadata } from '@nestjs/common';

export const IS_WX = 'is_wx';
export const WX = () => SetMetadata(IS_WX, true);
