import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicTacToeGateway } from './ttt.gateway';
import { TicTacToe } from './ttt.entity';
import { TttService } from './ttt.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicTacToe])],
  providers: [TicTacToeGateway, TttService],
})
export class TttModule {}
