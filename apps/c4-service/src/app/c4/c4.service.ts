import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    //if user already in room
    //      return exception
    //      create new game and room objects
    //      return the new room object
    if (await this.CheckInRoom(uid)) {
      throw new BadRequestException('already in a room');
    }
    const newRoom = new Room();
    await this.roomRepo.save(newRoom);

    const newGame = new Connect4();
    newGame.rid = newRoom.id;
    await this.c4Repo.save(newGame);

    newRoom.currentGame = newGame;
    console.log("hello");
    return this.roomRepo.save(newRoom);

    // return this.JoinRoom(uid, newRoom.id);
  }

  async CheckInRoom(uid: number) {
    const room: Room = await this.roomRepo.findOne({
      where: [{ p1: uid }, { p2: uid }],
    });
    if (!room) {
      return false;
    }
    return true;
  }

  async onDisconnect(uid: number): Promise<Room> {
    let room: Room = await this.roomRepo.findOneBy({ p1: uid });
    if (!room) {
      room = await this.roomRepo.findOneBy({ p2: uid });
      if (!room) return;
      room.currentGame.winner = 'x';
      room.p2 = null;
      room = await this.roomRepo.save(room);
      await this.c4Repo.save(room.currentGame);
    } else {
      room.currentGame.winner = 'o';
      room.p1 = null;
      room = await this.roomRepo.save(room);
      await this.c4Repo.save(room.currentGame);
    }
  }

  async JoinRoom(uid: number, roomID: number): Promise<Room> {
    //check if user is already in a room
    //      check if room exists
    if (await this.CheckInRoom(uid)) {
      throw new BadRequestException('already in a room');
    }

    console.log("Room ID: " + roomID);

    const room: Room = await this.roomRepo.findOneBy({ id: roomID });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    console.log("room found");

    console.log(room);

    // stupid way of doing this, for some reason querying by gid doesnt work

    console.log("game found");

    if (!room.p1) {
      room.p1 = uid;
      room.currentGame.player1 = uid;
    } else if (!room.p2 && room.p1 != uid) {
      room.p2 = uid;
      room.currentGame.player2 = uid;
    } else {
      throw new BadRequestException('full room');
    }

    console.log("What's up");

    await this.c4Repo.save(room.currentGame);
    return this.roomRepo.save(room);
  }

  async MakeMove(uid: number, move: number, roomID: number): Promise<Connect4> {
    //get the game for this specific room
    //      call the object's makemove method with uid, move arguments
    //      return the new game board
    const room: Room = await this.roomRepo.findOneBy({ id: roomID });
    if (!room) {
      throw new BadRequestException('Room not found');
    }
    console.log("Game found");
    const game: Connect4 = room.currentGame;
    game.MakeMove(uid, move);
    return this.c4Repo.save(game);
  }

  async Replay(roomID: number) {
    const room: Room = await this.roomRepo.findOneBy({ id: roomID });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    const game: Connect4 = room.currentGame;
    game.ResetBoard();
    return this.c4Repo.save(game);
  }
}
