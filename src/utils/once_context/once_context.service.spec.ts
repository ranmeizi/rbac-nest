import { Test, TestingModule } from '@nestjs/testing';
import { OnceContextService } from './once_context.service';

describe('OnceContextService', () => {
  let service: OnceContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnceContextService],
    }).compile();

    service = module.get<OnceContextService>(OnceContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
