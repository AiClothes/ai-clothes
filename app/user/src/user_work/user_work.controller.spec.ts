import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkController } from './user_work.controller';
import { UserWorkService } from './user_work.service';

describe('UserWorkController', () => {
  let controller: UserWorkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWorkController],
      providers: [UserWorkService],
    }).compile();

    controller = module.get<UserWorkController>(UserWorkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
