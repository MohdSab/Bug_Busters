import { BadRequestException, Inject, Injectable, Sse } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Repository } from 'typeorm';
import { Connect4 } from './c4.entity';

@Injectable()
export class Connect4Service {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,

    @InjectRepository(Connect4)
    private c4Repo: Repository<Connect4>
  ) {}

  async CreateRoom(uid: number): Promise<Room> {
    //TODO: if user already in room
    //      return exception
    //      create new game and room objects
    //      return the new room object
    if (await this.CheckInRoom(uid)) {
      throw new BadRequestException('already in a room');
    }
    let newGame = new Connect4();
    newGame = await this.c4Repo.save(newGame);

    let newRoom = new Room();
    newRoom.currentGame = newGame;
    newRoom = await this.roomRepo.save(newRoom);

    return this.JoinRoom(uid, newRoom.id);
  }

  async CheckInRoom(uid: number) {
    const room: Room = await this.roomRepo.findOne({
      where: [{ p1: uid }, { p2: uid }],
    });
    if (!room) {
      return true;
    }
    return false;
  }

  async JoinRoom(uid: number, roomID: number): Promise<Room> {
    //TODO: check if user is already in a room
    //      check if room exists
    if (this.CheckInRoom(uid)) {
      throw new BadRequestException('already in a room');
    }
    const room: Room = await this.roomRepo.findOneBy({ id: roomID });
    if (!room) {
      throw new BadRequestException('no room exists with that id');
    }
    const game: Connect4 = await this.c4Repo.findOneBy({
      gid: room.currentGame.gid,
    });
    if (!game.player1) {
      room.p1 = uid;
      game.SetPlayer1(uid);
    } else if (!game.player2) {
      room.p2 = uid;
      game.SetPlayer2(uid);
    } else {
      throw new BadRequestException('full room');
    }
    this.c4Repo.save(game);
    return this.roomRepo.save(room);
  }

  async MakeMove(uid: number, move: number, roomID: number): Promise<Connect4> {
    //TODO: get the game for this specific room
    //      call the object's makemove method with uid, move arguments
    //      return the new game board
    const room: Room = await this.roomRepo.findOneBy({ id: roomID });
    if (!room) {
      throw new BadRequestException('no room exists with that id');
    }
    const game: Connect4 = room.currentGame;
    game.MakeMove(uid, move);
    return this.c4Repo.save(game); //temp return just to satisfy compiler
  }

  async Replay(roomID: number) {
    const room: Room = await this.roomRepo.findOneBy({ id: roomID });
    if (!room) {
      throw new BadRequestException('no room exists with that id');
    }
    const game: Connect4 = room.currentGame;
    game.ResetBoard();
    return this.c4Repo.save(game);
  }
}
