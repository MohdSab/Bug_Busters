import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { AppService } from './app.service';

import { Request } from 'express';

export type SignUpDTO = {
  username: string;
  password: string;
  avatar?: string;
};

export type SignInDTO = {
  username: string;
  password: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('/signup')
  signup(@Body() body: SignUpDTO) {
    return this.appService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SignInDTO) {
    return this.appService.signin(body.username, body.password);
  }

  @Post('/signout')
  signout() {}

  @Get('/account')
  async getAccount(@Req() req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer')
      throw new UnauthorizedException("Where's your token?");

    const account = await this.appService.verify(token);

    if (!account) throw new UnauthorizedException("Account doesn't exist");
    return account;
  }

  @Put('/profile')
  updateProfile() {}

  @Get('/avatars')
  getAvatars() {
    return this.appService.getAvatars();
  }
}
