import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppService } from './app.service';
import { Account } from './account.entity';
import { Profile } from './profile.entity';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const accountRepoToken = getRepositoryToken(Account);
    const profileRepoToken = getRepositoryToken(Profile);

    const app = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'mysecret',
          signOptions: { expiresIn: '600s' },
        }),
      ],
      providers: [
        AppService,
        {
          provide: accountRepoToken,
          useClass: Repository,
        },
        {
          provide: profileRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
