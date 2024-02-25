import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicTacToeGameLogic } from './ttt-game-logic-gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicTacToe } from './ttt.entity';
// import { TttRepo } from './ttt.repo';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'ttt',
      entities: [TicTacToe],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([TicTacToe]),
  ],
  controllers: [AppController],
  providers: [AppService, TicTacToeGameLogic],
})
export class AppModule {}
