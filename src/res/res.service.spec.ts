import { Test, TestingModule } from '@nestjs/testing';
import { ResService } from './res.service';

describe('ResService', () => {
  let service: ResService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResService],
    }).compile();

    service = module.get<ResService>(ResService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
