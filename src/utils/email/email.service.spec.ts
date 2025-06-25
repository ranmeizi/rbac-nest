import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { HttpModule } from '@nestjs/axios';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
      imports: [HttpModule],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test randomString', async () => {
    const str = await service.getRandomString();
    console.log('randomString:', str);
    expect(str.length).toBe(32);
  });

  it('test hash', async () => {
    const str = await service.getHash();
    console.log('hahahashi', str);
    expect(str).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});
