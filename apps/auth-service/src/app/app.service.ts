import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

type TokenPayload = {
  sub: number,
  username: string
}

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
      // const access_token = await this.jwtService.signAsync(payload);
      // localStorage.setItem("access_token", access_token);
    } else {
      throw new UnauthorizedException("Wrong username/password.");
    }
  }

  async signup(username: string, password: string) {
    let user: Account = await this.accountRepo.findOne({where: {username: username}}) 
    if (user == null) {
        throw new UnauthorizedException("Username already exists.");
    }
    user = new Account();
    user.SetUsername(username);
    user.SetPassword(password);
    await this.accountRepo.save(user);
    const payload = { sub: user.uid, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      }
      // const access_token = await this.jwtService.signAsync(payload)
      // localStorage.setItem("access_token", access_token);
  }

  signout() {
  }

  async verify(access_token: string): Promise<Account> {
    try {
      const decoded = this.jwtService.verify<TokenPayload>(access_token, {
        secret: "mysecret", 
      });

      console.log(decoded);
      
      const user: Account = await this.accountRepo.findOneBy({uid: decoded.sub});
      if (user == null) return null;
      console.log("User: ", user);
      return user;
      
    } catch (error) {
      return null;
    }
  }
}
