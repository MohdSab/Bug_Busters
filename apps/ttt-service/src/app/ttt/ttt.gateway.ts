import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicTacToe } from './ttt.entity';
import { TTTService } from './ttt.service';
import { Room } from './room.entity';

export type NewGameState = {
  roomNumber: number;
  board: string[];
  // currPlayer: number, <- took this out for now cuz i dont think its useful?
  winner: string | null;
  wonBy: number[] | null; // array of length 3 of the indices resulting in the winning play
  validResponse: boolean; // if this is false then the function did not do what its supposed to do
};

export type MessageDTO = {
  roomCode: number | null;
  currentPlayer: number | null;
  move: number | null;
};

type ResponseDTO<T> = {
  error?: string;
  data: T;
}

const port = +process.env.WS_PORT || 8000;

// TODO: change to whatever port we end up using
@WebSocketGateway(port, {
  path: '/ttt',
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: true,
  },
})
export class TicTacToeGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // @InjectRepository(TicTacToe)
  // private tttRepo: Repository<TicTacToe>;

  constructor(private tttService: TTTService){}

  /**
   * Special function of OnGatewayConnection
   * @param client
   */
  handleConnection(client: Socket) {
    console.log("client connected: ", client.id);
  }

  afterInit(server: Server) {
    console.log("WS server is running on port: ", port);
  }

  handleDisconnect(client: Socket) {
    console.log("client disconencted: ", client.id);
  }

  @SubscribeMessage('move')
  async handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDTO
  ) {
    /*
     * Receives move from some player (stored in data), move may be valid/invalid
     * If valid,
     *   -update
     *       -game state (board)
     *       -currPlayer
     *   -check for winner
     * If invalid, change nothing
     *
     * json input data format:
     * {
     *   roomCode: room number (String),
     *   currentPlayer: uid,
     *   move: index within board
     * }
     * 
     * required data: roomCode, currentPlayer, move
     */
    // try {
    //     let payload: NewGameState;
    //     const ttt: TicTacToe = await this.tttRepo.findOne({
    //         where: { roomCode: data.roomCode },
    //     });

    //     payload.wonBy = ttt.MakeMove(data.currentPlayer, data.move);
    //     payload.board = ttt.board;
    //     payload.winner = ttt.winner;
    //     payload.roomNumber = ttt.roomCode;
    //     payload.validResponse = true;

    //     await this.tttRepo.save(ttt);

    //     return JSON.stringify(payload);

    // } catch (error) {
    //     console.log('Error making a move', error);
    // }
  }

  @SubscribeMessage('create-room')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDTO
  ): Promise<Room> {

    /*
     * Create a room where the player who created it
     * is the xPlayer
     * 
     * required data: currentPlayer
     */
    // try {
    //   // create a new TTT object and update attributes
    //   const ttt = new TicTacToe();
    //   ttt.SetXPlayer(data.currentPlayer);
    //   await this.tttRepo.save(ttt);

    //   // connect client to the room
    //   client.join(String(ttt.roomCode));

    //   // return results
    //   const payload: NewGameState = {
    //     board: ttt.board,
    //     roomNumber: ttt.roomCode,
    //     winner: ttt.winner,
    //     wonBy: null,
    //     validResponse: true,
    //   };
    //   return JSON.stringify(payload);
    // } catch (error) {
    //   console.error('Error creating a room: oops :(((', error);
    // }
    const room = await this.tttService.createRoom();
    client.join('' + room.id);
    return room;
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number
  ): Promise<ResponseDTO<Room>> {
    const uid = client.handshake.auth.uid;

    try {
      const room = await this.tttService.joinRoom(uid, roomId);
      
      client.join(String(room));
      client.to(String(room)).emit('player-joined', room);
      return {
        data: room
      }
    } catch(err) {
      return {
        error: err,
        data: null
      }
    }

    /*
     * Join a created room using the room id for the game
     * becomes the oPlayer if oPlayer is null
     * becomes spectator if oPlayer is not null
     *
     * required data: roomCode, currentPlayer
     */
    // try {
    //   let payload: NewGameState;

    //   // check if a room with this code exists
    //   const ttt: TicTacToe = await this.tttRepo.findOne({
    //     where: { roomCode: data.roomCode },
    //   });
    //   if (!ttt) {
    //     payload.validResponse = false;
    //     return JSON.stringify(payload);
    //   }

    //   // if the room exists, update TTT object and connect client
    //   // if there is not an oPlayer, the client becomes the oPlater
    //   // otherwise they are a specator (no change)
    //   if (!ttt.oPlayer) {
    //     ttt.SetOPlayer(data.currentPlayer);
    //     await this.tttRepo.save(ttt);
    //   }
    //   client.join(String(ttt.roomCode));

    //   // return results
    //   payload.validResponse = true;
    //   payload.board = ttt.board;
    //   payload.roomNumber = ttt.roomCode;
    //   payload.winner = ttt.winner;
    //   payload.wonBy = null;
    //   return JSON.stringify(payload);
    // } catch (error) {
    //   console.error('Error joining a room', error);
    // }
  }

  @SubscribeMessage('replay')
  async handleReplay(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDTO
  ) {
    /*
     * Reset game state, winner, currPlayer, and board
     * room code will be kept the same
     *
     * required data: none
     */
    // try {
    //     let payload: NewGameState;

    //     const ttt: TicTacToe = await this.tttRepo.findOne({
    //         where: { roomCode: data.roomCode },
    //     });
    //     if (!ttt) {
    //         payload.validResponse = false;
    //         return JSON.stringify(payload);
    //     }

    //     ttt.ResetBoard();
    //     await this.tttRepo.save(ttt);

    //     payload.board = ttt.board;
    //     payload.wonBy = null;
    //     payload.winner = null;
    //     payload.roomNumber = data.roomCode;
    //     payload.validResponse = true;

    //     return JSON.stringify(payload);

    // } catch (error) {
    //     console.log('Error replaying', error);
    // }
  }
}