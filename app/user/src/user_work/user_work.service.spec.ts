import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkService } from './user_work.service';

describe('UserWorkService', () => {
  let service: UserWorkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWorkService],
    }).compile();

    service = module.get<UserWorkService>(UserWorkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
