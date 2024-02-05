import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Account } from './account.entity';
import { Profile } from './profile.entity';

describe('AppController', () => {
  let app: TestingModule;
  const accountRepoToken = getRepositoryToken(Account);
  const profileRepoToken = getRepositoryToken(Profile);

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'mysecret',
          signOptions: { expiresIn: '600s' },
        }),
      ],
      controllers: [AppController],
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
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
