import { Module } from '@nestjs/common';
import { UserWorkService } from './user_work.service';
import { UserWorkController } from './user_work.controller';

@Module({
  controllers: [UserWorkController],
  providers: [UserWorkService],
})
export class UserWorkModule {}
