import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TicTacToe } from './ttt.entity';
import { createRoom } from '@bb/chat-api-lib'

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

    const newRoom = new Room();
    await this.roomRepo.save(newRoom);

    const newGame = new TicTacToe();
    newGame.rid = newRoom.id;
    await this.tttRepo.save(newGame);

    newRoom.currentGame = newGame;

    await createRoom('ttt', newRoom.id);

    return this.roomRepo.save(newRoom);
  }

  async makeRoomAI(uid: number): Promise<Room> {
    const room = await this.createRoom(uid);
    // const room = await this.roomRepo.findOneBy({ id: roomId });
    room.p2 = -1;

    room.currentGame.oPlayer = -1;
    await this.tttRepo.save(room.currentGame);

    return this.roomRepo.save(room);
  }

  async joinRoom(uid: number, roomId: number): Promise<Room> {
    if (await this.checkInRoom(uid)) {
      throw new BadRequestException('ur already in a room smh');
    }

    const room = await this.roomRepo.findOneBy({ id: roomId });
    if (!room) throw new BadRequestException('Room does not exist');

    if (!room.p1) {
      room.p1 = uid;
      room.currentGame.xPlayer = uid;
    } else if (!room.p2) {
      room.p2 = uid;
      room.currentGame.oPlayer = uid;
    }

    await this.tttRepo.save(room.currentGame);

    return this.roomRepo.save(room);
  }

  async checkInRoom(uid: number) {
    const room = await this.roomRepo.findOneBy({ p1: uid });
    if (room !== null) {
      return true;
    }
    return false;
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
    if (ttt.winner != null) return ttt;
    if (ttt.board[ind] !== ' ') return ttt;
    if (ttt.oPlayer != -1) {
      if (ttt.xIsPlaying && currentPlayer === ttt.xPlayer) {
        ttt.board[ind] = 'x';
        ttt.xIsPlaying = false;
        this.CheckWin(ttt);
        if (ttt.wonBy != null) {
          ttt.winner = 'x';
        }
      } else if (!ttt.xIsPlaying && currentPlayer === ttt.oPlayer) {
        ttt.board[ind] = 'o';
        ttt.xIsPlaying = true;
        this.CheckWin(ttt);
        if (ttt.wonBy != null) {
          ttt.winner = 'o';
        }
      }
    } else {
      ttt.board[ind] = 'x';
      ttt.xIsPlaying = false;
      this.CheckWin(ttt);
      if (ttt.wonBy != null) {
        ttt.winner = 'x';
        return this.tttRepo.save(ttt);
      }
      const ai_ind: number = Math.floor(Math.random() * 9);
      ttt.board[ai_ind] = 'o';
      ttt.xIsPlaying = true;
      this.CheckWin(ttt);
      if (ttt.wonBy != null) {
        ttt.winner = 'o';
      }
    }
    return this.tttRepo.save(ttt);
  }

  /*
   * update wonBy to the winning tuple if someone wins, null otherwise
   */
  CheckWin(ttt: TicTacToe) {
    for (let i = 0; i < 3; i++) {
      if (
        ttt.board[3*i] !== ' ' && // check row
        ttt.board[3*i] === ttt.board[3*i + 1] &&
        ttt.board[3*i] === ttt.board[3*i + 2]
      ) {
        ttt.wonBy = [3*i, 3*i + 1, 3*i + 2];
        return;
      }
      if (
        ttt.board[i] !== ' ' && // check column
        ttt.board[i] === ttt.board[i + 3] &&
        ttt.board[i] === ttt.board[i + 6]
      ) {
        ttt.wonBy = [i, i + 3, i + 6];
        return;
      }
    }
    if (
      ttt.board[0] !== ' ' && // check diag \
      ttt.board[0] === ttt.board[4] &&
      ttt.board[0] === ttt.board[8]
    ) {
      ttt.wonBy = [0, 4, 8];
      return;
    }
    if (
      ttt.board[2] !== ' ' && // check diag /
      ttt.board[2] === ttt.board[4] &&
      ttt.board[2] === ttt.board[6]
    ) {
      ttt.wonBy = [2, 4, 6];
      return;
    }
    ttt.wonBy = null;
  }

  async findGame(roomId: number) {
    const room = await this.roomRepo.findOneBy({ id: roomId });
    return room.currentGame;
  }

  async ResetBoard(roomId: number) {
    const ttt = await this.findGame(roomId);
    ttt.board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    ttt.xIsPlaying = true;
    ttt.winner = null;
    await this.tttRepo.save(ttt);
  }
}
