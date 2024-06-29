import { Test, TestingModule } from '@nestjs/testing';
import { SystemOperateLogController } from './system_operate_log.controller';
import { SystemOperateLogService } from './system_operate_log.service';

describe('SystemOperateLogController', () => {
  let controller: SystemOperateLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemOperateLogController],
      providers: [SystemOperateLogService],
    }).compile();

    controller = module.get<SystemOperateLogController>(SystemOperateLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
