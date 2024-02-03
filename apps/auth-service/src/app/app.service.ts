import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    // @Inject(AccountRepo)
    // accountRepo: AccountRepo
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    private jwtService: JwtService
  ) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async signin(username: string, password: string) {
    const user: Account = await this.accountRepo.findOne({where: {username: username}}) 
    if (user == null) {
        throw new UnauthorizedException("User does not exist.");
    }
    if (user.MatchPassword(password)) {
      const payload = { sub: user.uid, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      }
    }
  }

  signup(username: string, ) {}

  signout() {}

  verify() {}
}
