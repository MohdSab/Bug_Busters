import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Profile } from './profile.entity';

type TokenPayload = {
  sub: number;
  username: string;
};

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    private jwtService: JwtService
  ) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async signin(username: string, password: string) {
    const user: Account = await this.accountRepo.findOne({
      where: { username: username },
    });
    if (user == null) {
      throw new UnauthorizedException('User does not exist.');
    }
    if (user.MatchPassword(password)) {
      const payload = { sub: user.uid, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException('Wrong username/password.');
    }
  }

  async signup(username: string, password: string) {
    let user: Account = await this.accountRepo.findOne({
      where: { username: username },
    });
    if (user != null) {
      throw new UnauthorizedException('Username already exists.');
    }

    const p: Profile = new Profile();
    p.index = 3;

    await this.profileRepo.save(p);

    user = new Account();
    user.SetUsername(username);
    user.SetPassword(password);
    user.profile = p;
    await this.accountRepo.save(user);
    const payload = { sub: user.uid, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  signout() {}

  async verify(access_token: string): Promise<Account> {
    try {
      const decoded = this.jwtService.verify<TokenPayload>(access_token, {
        secret: 'mysecret',
      });

      console.log(decoded);

      const user: Account & { profile: { avatarUrl?: string } } =
        await this.accountRepo.findOneBy({ uid: decoded.sub });
      if (user == null) return null;

      user.profile.avatarUrl = user.profile.GetPicturePath();
      return user;
    } catch (error) {
      return null;
    }
  }

  async signinGuest() {
    let user:Account = new Account();
    await this.accountRepo.save(user);

    user.SetUsername('HappyGuest' + user.GetUID());
    user.SetPassword(null);
    user.profile = new Profile();
    user.profile.index = 3;

    await this.profileRepo.save(user.profile);
    await this.accountRepo.save(user);

    const payload = { sub: user.uid, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

}
