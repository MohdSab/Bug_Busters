import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppService } from './app.service';
import { Account } from './account.entity';
import { Profile } from './profile.entity';

class AccountRepo extends Repository<Account> {}

class ProfileRepo extends Repository<Profile> {}

describe('AppService', () => {
  let service: AppService;
  let accountRepo: AccountRepo;
  let profileRepo: ProfileRepo;

  const acc1: Account = new Account();
  acc1.uid = 0;
  acc1.username = 'pupupupu';
  acc1.password = 'acc1';
  acc1.profile = new Profile();
  acc1.profile.index = 1;

  const acc2: Account = new Account();
  acc2.uid = 1;
  acc2.username = 'seb';
  acc2.password = 'acc2';
  acc2.profile = new Profile();
  acc2.profile.index = 2;

  const acc3: Account = new Account();
  acc3.uid = 2;
  acc3.username = 'steph';
  acc3.password = 'acc3';
  acc3.profile = new Profile();
  acc3.profile.index = 3;

  const acc4: Account = new Account();
  acc4.uid = 3;
  acc4.username = 'rise';
  acc4.password = 'acc4';
  acc4.profile = new Profile();
  acc4.profile.index = 4;

  const acc5: Account = new Account();
  acc5.uid = 4;
  acc5.username = 'zef';
  acc5.password = 'acc5';
  acc5.profile = new Profile();
  acc5.profile.index = 5;

  const acc6: Account = new Account();
  acc6.uid = 5;
  acc6.username = 'duck';
  acc6.password = 'acc6';
  acc6.profile = new Profile();
  acc6.profile.index = 6;

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
        {
          provide: accountRepoToken,
          useClass: AccountRepo,
        },
        {
          provide: profileRepoToken,
          useClass: ProfileRepo,
        },
        AppService,
      ],
    }).compile();

    service = app.get<AppService>(AppService);
    accountRepo = app.get<AccountRepo>(accountRepoToken);
    profileRepo = app.get<ProfileRepo>(profileRepoToken);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('signup', () => {
    it('Should gives tokens', () => {
      // Cannot find the user
      jest
        .spyOn(accountRepo, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(null));

      jest
        .spyOn(accountRepo, 'save')
        .mockResolvedValueOnce(Promise.resolve(acc1));
      jest
        .spyOn(profileRepo, 'save')
        .mockResolvedValueOnce(Promise.resolve(acc1.profile));

      console.log(service);

      return service.signup(acc1.username, acc1.password).then((res) => {
        expect(res).toHaveProperty('access_token');
        // Not this sprint
        // expect(res).toHaveProperty('refresh_token');
      });
    });

    it('Should not success', () => {
      // Mock already exists
      jest
        .spyOn(accountRepo, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(acc2));

      return service
        .signup(acc2.username, acc2.password)
        .then(() => {
          expect(true).toBe(false);
        })
        .catch((err) => {
          expect(err).toBeDefined();
        });
    });
  });

  describe('signin', () => {
    it('Should gives tokens', () => {
      jest
        .spyOn(accountRepo, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(acc3));

      return service.signin(acc3.username, acc3.password).then((res) => {
        expect(res).toHaveProperty('access_token');
        // Not this sprint
        // expect(res).toHaveProperty('refresh_token');
      });
    });
  });
});
