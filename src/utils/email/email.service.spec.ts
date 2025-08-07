import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { HttpModule } from '@nestjs/axios';
import { EmailModule } from './email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from 'src/db';
import * as crypto from 'crypto';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            ...dataSourceOptions,
            migrations: [],
            autoLoadEntities: true,
          }),
        }),
        EmailModule,
      ],
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

  // 测试 des 加密参数
  const params = {
    code: '12345678',
  };
  const expect_param = 'Va6/Mopmpoj72+PllpMEERRjcu7oDf/D2s8zwk+nZPw=';

  it('test des encrypt', async () => {
    const str = service._encryptSearch(params);

    console.log('temp_str', str);

    expect(str).toBe(expect_param);
  });
  it('test des decrype', async () => {
    const obj = service._decryptSearch(expect_param);

    console.log('params', params);

    expect(JSON.stringify(params)).toBe(JSON.stringify(obj));
  });
});
