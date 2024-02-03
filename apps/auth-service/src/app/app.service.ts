import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    // @Inject(AccountRepo)
    // accountRepo: AccountRepo
    @InjectRepository(Account)
    accountRepo: Repository<Account>
  ) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  signin() {}

  signup() {}

  signout() {}

  verify() {}
}
