import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicTacToeGateway } from './ttt.gateway';
import { TicTacToe } from './ttt.entity';
import { TTTService } from './ttt.service';
import { Room } from './room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicTacToe, Room])],
  providers: [TicTacToeGateway, TTTService],
})
export class TttModule {}
