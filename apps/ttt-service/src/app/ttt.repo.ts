import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TicTacToe } from './ttt.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TttRepo {
  constructor(
    @InjectRepository(TicTacToe)
    private tttRepo: Repository<TicTacToe>
  ) {}

  GetAll(): Promise<TicTacToe[]> {
    return Promise.resolve([]);
  }

  Get(roomCode: number): Promise<TicTacToe> {
    return this.tttRepo.findOneBy({ roomCode: roomCode });
  }

  async Create(ttt: TicTacToe): Promise<TicTacToe> {
    return this.tttRepo.save({
      board: ttt.board,
      xPlayer: ttt.xPlayer,
      oPlayer: ttt.oPlayer,
      xIsPlaying: ttt.xIsPlaying,
      winner: ttt.winner
    });
  }

  Update(ttt: TicTacToe): Promise<TicTacToe> {
    return this.tttRepo.save(ttt);
  }

  Delete(ttt: TicTacToe): Promise<void> {
    return Promise.resolve();
  }
}
