import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { EmailModule } from './email.module';
import { AuthModule } from 'src/rbac/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions, getTestingModule } from 'src/db';
import { HttpModule } from '@nestjs/axios';
import { VerifyCode } from 'src/entities/verify_code.entity';
import { VerifyCodeLog } from 'src/entities/verify_code_log.entity';
import { decryptSearch, encryptSearch } from './crypto.util';
import { UsersModule } from 'src/rbac/users/users.module';
import { GoogleOauthModule } from 'src/oauth/google-oauth/google-oauth.module';
import { OnceContextModule } from '../once_context/once_context.module';
import { CrudModule } from '../crud/crud.module';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
      imports: [
        ...getTestingModule(),
        UsersModule,
        AuthModule,
        GoogleOauthModule,
        OnceContextModule,
        CrudModule,
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
    const str = encryptSearch(params);

    console.log('temp_str', str);

    expect(str).toBe(expect_param);
  });
  it('test des decrype', async () => {
    const obj = decryptSearch(expect_param);

    const shishi = decryptSearch(
      'I1p60p6b6yJXRymoQPBemBx5WyXAquR5Koq AyP4mPBj775sowgUp25plbsgG6wW',
    );

    console.log('shishi', shishi);

    console.log('params', params);

    expect(JSON.stringify(params)).toBe(JSON.stringify(obj));
  });
});
