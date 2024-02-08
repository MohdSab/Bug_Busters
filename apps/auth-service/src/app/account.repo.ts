import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountRepo {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>
  ) {}

  GetAll(): Promise<Account[]> {
    return Promise.resolve([]);
  }

  Get(id: number): Promise<Account> {
    return this.accountRepo.findOneBy({ uid: id });
  }

  async Create(acc: Account): Promise<Account> {
    // TODO hash the password
    return this.accountRepo.save({
      username: acc.username,
      password: acc.password,
    });
  }

  Update(acc: Account): Promise<Account> {
    return Promise.resolve(null);
  }

  Delete(acc: Account): Promise<void> {
    return Promise.resolve();
  }
}
