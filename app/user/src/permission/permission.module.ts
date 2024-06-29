import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

@Module({
  providers: [PermissionService],
  exports: [PermissionService],
  controllers: [PermissionController],
  imports: []
})
export class PermissionModule {}
