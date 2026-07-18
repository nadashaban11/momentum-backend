import { Test, TestingModule } from '@nestjs/testing';
import { CheckInsService } from './check-ins.service';

describe('CheckInsService', () => {
  let service: CheckInsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckInsService],
    }).compile();

    service = module.get<CheckInsService>(CheckInsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
