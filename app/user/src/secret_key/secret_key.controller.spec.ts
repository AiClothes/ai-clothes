import { Test, TestingModule } from '@nestjs/testing';
import { SecretKeyController } from './secret_key.controller';
import { SecretKeyService } from './secret_key.service';

describe('SecretKeyController', () => {
  let controller: SecretKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretKeyController],
      providers: [SecretKeyService],
    }).compile();

    controller = module.get<SecretKeyController>(SecretKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
