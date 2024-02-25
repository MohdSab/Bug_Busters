import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicTacToeGameLogic } from './ttt-game-logic-gateway';
import { TttRepo } from './ttt.repo';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TicTacToeGameLogic, TttRepo],
})
export class AppModule {}
