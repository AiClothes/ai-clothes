import { Test, TestingModule } from '@nestjs/testing';
import { LogisticController } from './logistic.controller';
import { LogisticService } from './logistic.service';

describe('LogisticController', () => {
  let controller: LogisticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogisticController],
      providers: [LogisticService],
    }).compile();

    controller = module.get<LogisticController>(LogisticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
