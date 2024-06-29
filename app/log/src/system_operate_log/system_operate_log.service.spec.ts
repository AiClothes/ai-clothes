import { Test, TestingModule } from '@nestjs/testing';
import { SystemOperateLogService } from './system_operate_log.service';

describe('SystemOperateLogService', () => {
  let service: SystemOperateLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemOperateLogService],
    }).compile();

    service = module.get<SystemOperateLogService>(SystemOperateLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
