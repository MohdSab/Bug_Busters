import { Test } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fsPromises from 'node:fs/promises';

import { AppService } from './app.service';
import { Account } from './account.entity';
import { Profile } from './profile.entity';

class AccountRepo extends Repository<Account> {}

class ProfileRepo extends Repository<Profile> {}

describe('Profile', () => {
    const p1 = new Profile();
    p1.avatar = '1';
    p1.id = 1;

  describe('GetPicPath', () => {
    it('should return "Hello API"', () => {
      expect(p1.GetPicturePath()).toEqual(`/profiles/1`);
    });
  });

});
