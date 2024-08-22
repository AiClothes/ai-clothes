import { Test, TestingModule } from '@nestjs/testing';
import { SecretKeyService } from './secret_key.service';

describe('SecretKeyService', () => {
  let service: SecretKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecretKeyService],
    }).compile();

    service = module.get<SecretKeyService>(SecretKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
