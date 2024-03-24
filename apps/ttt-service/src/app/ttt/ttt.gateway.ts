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
  // currentPlayer: number | null;
  move: number | null;
};

type ResponseDTO<T> = {
  error?: string;
  data: T;
};

const port = +process.env.WS_PORT || 8000;

@WebSocketGateway(port, {
  path: process.env.WS_PATH || '/ttt',
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: true,
  },
})
export class TicTacToeGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // @InjectRepository(TicTacToe)
  // private tttRepo: Repository<TicTacToe>;

  constructor(private tttService: TTTService) {}

  /**
   * Special function of OnGatewayConnection
   * @param client
   */
  handleConnection(client: Socket) {
    console.log('client connected: ', client.id);
  }

  afterInit(server: Server) {
    console.log('WS server is running on port: ', port);
  }

  async handleDisconnect(client: Socket) {
    const room: Room = await this.tttService.onDisconnect(
      client.handshake.auth.uid
    );
    // Since this gets called if someone leaves the landing page,
    // who might not necessarily be in a room yet,
    // this check should be optional.
    if (room != null) {
      console.log('Disconnecting from room', room.id);
      this.server.to(String(room.id)).emit('player-disconnected', {
        error: null,
        data: room,
      });
    }
    console.log('client disconencted: ', client.id);
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
     * required data: roomCode, move
     */
    const ttt = await this.tttService.MakeMove(
      client.handshake.auth.uid,
      data.move,
      data.roomCode
    );
    this.server.to(String(data.roomCode)).emit('player-moved', ttt);
    return ttt;
  }

  @SubscribeMessage('create-room')
  async createRoom(@ConnectedSocket() client: Socket): Promise<Room> {
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
    console.log(client.handshake.auth.uid);
    const room = await this.tttService.createRoom(client.handshake.auth.uid);
    client.join('' + room.id);
    return room;
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    /*
     * Join a created room using the room id for the game
     * becomes the oPlayer if oPlayer is null
     * becomes spectator if oPlayer is not null
     *
     * required data: roomCode, currentPlayer
     */
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number
  ): Promise<ResponseDTO<Room>> {
    const uid = client.handshake.auth.uid;

    try {
      const room = await this.tttService.joinRoom(uid, roomId);

      client.join(String(room.id));
      client.to(String(room.id)).emit('player-joined', room);
      return {
        data: room,
      };
    } catch (err) {
      return {
        error: err,
        data: null,
      };
    }
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
     * required data: roomCode
     */
    this.tttService.ResetBoard(data.roomCode);
    this.server.to(String(data.roomCode)).emit('replay');
  }
}
