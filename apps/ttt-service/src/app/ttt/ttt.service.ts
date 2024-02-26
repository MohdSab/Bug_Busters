import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TicTacToe } from './ttt.entity';

@Injectable()
export class TTTService {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,

    @InjectRepository(TicTacToe)
    private tttRepo: Repository<TicTacToe>
  ) {}

  async createRoom(): Promise<Room> {
    let newGame = new TicTacToe();
    newGame = await this.tttRepo.save(newGame);

    let newRoom = new Room();
    newRoom.currentGame = newGame;

    newRoom = await this.roomRepo.save(newRoom);

    return newRoom;
  }

  async joinRoom(uid: number, roomId: number): Promise<Room> {
    const room = await  this.roomRepo.findOneBy({ id: roomId });
    if (!room) throw new BadRequestException("Room does not exist");

    if (!room.p1) room.p1 = uid;
    else if (!room.p2) room.p2 = uid;
    else {
      throw new BadRequestException("Room is fulllllll");
    }

    return this.roomRepo.save(room);
  }

  // returns winning tuple if someone wins, null otherwise
  // MakeMove(currentPlayer: number, ind: number) {
  //   if (this.xIsPlaying && currentPlayer == this.xPlayer) {
  //     this.board[ind] = 'x';
  //     this.xIsPlaying = false;
  //     let result = this.CheckWin();
  //     if (result != null) {
  //       this.winner = 'x';
  //     }
  //     return result;
  //   } else if (!this.xIsPlaying && currentPlayer == this.oPlayer) {
  //     this.board[ind] = 'o';
  //     this.xIsPlaying = true;
  //     let result = this.CheckWin();
  //     if (result != null) {
  //       this.winner = 'o';
  //     }
  //     return result;
  //   }
  //   return null;
  // }

  // // returns winning tuple if someone wins, null otherwise
  // CheckWin() {
  //   for (let i = 0; i < 3; i++) {
  //     if (
  //       this.board[i] !== '' && // check row
  //       this.board[i] === this.board[i + 1] &&
  //       this.board[i] === this.board[i + 2]
  //     ) {
  //       return [i, i + 1, i + 2];
  //     }
  //     if (
  //       this.board[i] !== '' && // check column
  //       this.board[i] === this.board[i + 3] &&
  //       this.board[i] === this.board[i + 6]
  //     ) {
  //       return [i, i + 3, i + 6];
  //     }
  //   }
  //   if (
  //     this.board[0] !== '' && // check diag \
  //     this.board[0] === this.board[4] &&
  //     this.board[0] === this.board[8]
  //   ) {
  //     return [0, 4, 8];
  //   }
  //   if (
  //     this.board[2] !== '' && // check diag /
  //     this.board[2] === this.board[4] &&
  //     this.board[2] === this.board[6]
  //   ) {
  //     return [0, 4, 6];
  //   }
  //   return null;
  // }
}
