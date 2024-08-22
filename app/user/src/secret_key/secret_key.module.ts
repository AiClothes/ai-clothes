import { Module } from '@nestjs/common';
import { SecretKeyService } from './secret_key.service';
import { SecretKeyController } from './secret_key.controller';

@Module({
  controllers: [SecretKeyController],
  providers: [SecretKeyService],
})
export class SecretKeyModule {}
