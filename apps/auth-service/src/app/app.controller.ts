import { Controller, Get, Post, Put } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('/signup')
  signup() {
    this.appService.signup(/* Pass something here @Patricia*/);
  }

  @Post('/signin')
  signin() {}

  @Post('/signout')
  signout() {}

  @Put('/profile')
  updateProfile() {}
}
