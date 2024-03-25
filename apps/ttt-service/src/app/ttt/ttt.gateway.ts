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
import { Gateway } from '@bb/gateway-lib';
import { UnauthorizedException } from '@nestjs/common';

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

const port = +process.env.WS_PORT || 8031;

@WebSocketGateway(port, {
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
    new Gateway(`${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`)
      .RegisterService({
        key: process.env.WS_SERVICE_KEY,
        port: port,
      })
      .then((route) => {
        console.log(
          'WS Service register with key ' +
            route.key +
            ' with endpoint: ' +
            route.endpoint
        );
      })
      .catch(console.error);
  }

  async handleDisconnect(client: Socket) {
    console.log('client disconnecting', client.id);
    const room = await this.tttService.onDisconnect(client.handshake.auth.uid);
    // Since this gets called if someone leaves the landing page,
    // who might not necessarily be in a room yet,
    // this check should be optional.
    if (room) {
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
  ): Promise<ResponseDTO<TicTacToe>> {
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
    try {
      const ttt = await this.tttService.MakeMove(
        client.handshake.auth.uid,
        data.move,
        data.roomCode
      );
      client.to(String(data.roomCode)).emit('player-moved', ttt);
      return {
        data: ttt,
      };
    } catch (err) {
      return {
        data: null,
        error: err,
      };
    }
  }

  @SubscribeMessage('create-room')
  async createRoom(
    @ConnectedSocket() client: Socket
  ): Promise<ResponseDTO<Room>> {
    /*
     * Create a room where the player who created it
     * is the xPlayer
     *
     * required data: currentPlayer
     */

    try {
      if (!client.handshake.auth.uid) throw new UnauthorizedException();

      const room = await this.tttService.createRoom(client.handshake.auth.uid);
      // client.join('' + room.id);
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

  @SubscribeMessage('create-single')
  async createSingle(@ConnectedSocket() client: Socket): Promise<ResponseDTO<Room>> {
    /*
     * Create a room where the player who created it
     * is the xPlayer
     *
     * required data: currentPlayer
     */
    try {
      if (!client.handshake.auth.uid) throw new UnauthorizedException();

      const room = await this.tttService.makeRoomAI(client.handshake.auth.uid);

      return {
        data: room,
      };
    } catch (err) {
      return {
        error: err,
        data: null
      };
    }
    // const room = await this.tttService.makeRoomAI(client.handshake.auth.uid);
    // client.join('' + room.id);
    // return room;
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
      if (!uid) throw new UnauthorizedException();
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
