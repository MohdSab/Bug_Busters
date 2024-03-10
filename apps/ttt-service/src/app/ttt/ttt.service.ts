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

  async createRoom(uid: number): Promise<Room> {
    if (await this.checkInRoom(uid)) {
      throw new BadRequestException('ur already in a room smh');
    }

    let newGame = new TicTacToe();
    newGame = await this.tttRepo.save(newGame);

    let newRoom = new Room();
    newRoom.currentGame = newGame;

    newRoom = await this.roomRepo.save(newRoom);

    return this.joinRoom(uid, newRoom.id);
  }

  async joinRoom(uid: number, roomId: number): Promise<Room> {
    if (await this.checkInRoom(uid)) {
      throw new BadRequestException('ur already in a room smh');
    }

    const room = await this.roomRepo.findOneBy({ id: roomId });
    if (!room) throw new BadRequestException('Room does not exist');
    const game = await this.tttRepo.findOneBy({ gid: room.currentGame.gid });

    if (!room.p1) {
      room.p1 = uid;
      game.xPlayer = uid;
    }
    else if (!room.p2) {
      room.p2 = uid;
      game.oPlayer = uid;
    }
    else {
      throw new BadRequestException('Room is fulllllll');
    }
    this.tttRepo.save(game);

    return this.roomRepo.save(room);
  }

  async onDisconnect(uid: number): Promise<Room> {
    let room: Room = await this.roomRepo.findOneBy({ p1: uid });
    if (!room) {
      room = await this.roomRepo.findOneBy({ p2: uid });
      if (!room) {
        return;
      } else {
        room.currentGame.winner = 'x';
        room.p2 = null;
        room = await this.roomRepo.save(room);
        await this.tttRepo.save(room.currentGame);
      }
    } else {
      room.currentGame.winner = 'o';
      room.p1 = null;
      room = await this.roomRepo.save(room);
      await this.tttRepo.save(room.currentGame);
    }
    return room;
  }

  /*
   * returns winning tuple if someone wins, null otherwise
   */
  async MakeMove(currentPlayer: number, ind: number, roomId: number) {
    const ttt = await this.findGame(roomId);
    if (ttt.xIsPlaying && currentPlayer == ttt.xPlayer) {
      ttt.board[ind] = 'x';
      ttt.xIsPlaying = false;
      const wonBy = ttt.CheckWin();
      if (wonBy != null) {
        ttt.winner = 'x';
      }
    } else if (!ttt.xIsPlaying && currentPlayer == ttt.oPlayer) {
      ttt.board[ind] = 'o';
      ttt.xIsPlaying = true;
      const wonBy = ttt.CheckWin();
      if (wonBy != null) {
        ttt.winner = 'o';
      }
    }
    await this.tttRepo.save(ttt);
    return ttt;
  }

  async checkInRoom(uid: number) {
    const room = await this.roomRepo.findOneBy({ p1: uid });
    if (room != null) {
      return true;
    }
    return false;
  }

  async findGame(roomId: number) {
    const room = await this.roomRepo.findOneBy({ id: roomId });
    return room.currentGame;
  }

  async ResetBoard(roomId: number) {
    const ttt = await this.findGame(roomId);
    ttt.board = ['', '', '', '', '', '', '', '', ''];
    ttt.xIsPlaying = true;
    ttt.winner = null;
    await this.tttRepo.save(ttt);
  }
}
