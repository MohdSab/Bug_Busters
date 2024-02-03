import { Inject, Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { AccountRepo } from './account.repo';

@Injectable()
export class AppService {
  constructor(
    @Inject(AccountRepo)
    accountRepo: AccountRepo
  ) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  signin() {}

  signup() {}

  signout() {}

  verify() {}
}
