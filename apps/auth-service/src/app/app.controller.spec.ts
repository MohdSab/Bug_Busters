import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppController, SignUpDTO } from './app.controller';
import { AppService } from './app.service';
import { Account } from './account.entity';
import { Profile } from './profile.entity';
class AccountRepo extends Repository<Account> {}
class ProfileRepo extends Repository<Profile> {}

describe('AppController', () => {
  let app: TestingModule;
  let controller: AppController;
  let accountRepo: AccountRepo;
  let profileRepo: ProfileRepo;

  const acc1: Account = new Account();
  acc1.uid = 0;
  acc1.username = 'pupupupu';
  acc1.password = 'acc1';
  acc1.profile = new Profile();
  acc1.profile.avatar = '1';

  const acc2: Account = new Account();
  acc2.uid = 1;
  acc2.username = 'seb';
  acc2.password = 'acc2';
  acc2.profile = new Profile();
  acc2.profile.avatar = '2';

  const acc3: Account = new Account();
  acc3.uid = 2;
  acc3.username = 'steph';
  acc3.password = 'acc3';
  acc3.profile = new Profile();
  acc3.profile.avatar = '3';

  const acc4: Account = new Account();
  acc4.uid = 3;
  acc4.username = 'rise';
  acc4.password = 'acc4';
  acc4.profile = new Profile();
  acc4.profile.avatar = '4';

  const acc5: Account = new Account();
  acc5.uid = 4;
  acc5.username = 'zef';
  acc5.password = 'acc5';
  acc5.profile = new Profile();
  acc5.profile.avatar = '5';

  const acc6: Account = new Account();
  acc6.uid = 5;
  acc6.username = 'duck';
  acc6.password = 'acc6';
  acc6.profile = new Profile();
  acc6.profile.avatar = '6';
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

    controller = app.get<AppController>(AppController);
    accountRepo = app.get<AccountRepo>(accountRepoToken);
    profileRepo = app.get<ProfileRepo>(profileRepoToken);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(controller.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('signUp', () => {
    it('should return access_token', () => {
      const signUpData: SignUpDTO = {
        username: acc1.username,
        password: acc1.password,
        avatar: 'abcd',
      };

      jest
        .spyOn(accountRepo, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(null));

      jest
        .spyOn(accountRepo, 'save')
        .mockResolvedValueOnce(Promise.resolve(acc1));
      jest
        .spyOn(profileRepo, 'save')
        .mockResolvedValueOnce(Promise.resolve(acc1.profile));

      return controller.signup(signUpData).then((res) => {
        expect(res).toHaveProperty('access_token');
      });
    });
  });
});
