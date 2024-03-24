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
import { Connect4Service } from './c4.service';
import { Connect4 } from './c4.entity';
import { Room } from './room.entity';

//TODO: declare dto's
type MessageDTO = {
  roomCode: number | null;
  move: number | null;
};

type ResponseDTO<T> = {
  error?: string;
  data: T;
};

const port = +process.env.WS_PORT || 8001;

@WebSocketGateway(port, {
  path: '/c4',
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: true,
  },
})
export class Connect4Gateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  //TODO: put connect4 service as parameter to constructor for nestjs to handle dependency
  constructor(private C4service: Connect4Service) {}

  handleConnection(client: Socket) {
    console.log('client connected:', client.id);
  }

  afterInit(server: Server) {
    console.log('WS server is running on port:', port);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected:', client.id);
    //TODO: stuff
  }

  @SubscribeMessage('move')
  async handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDTO
  ): Promise<Connect4> {
    const c4: Connect4 = await this.C4service.MakeMove(
      client.handshake.auth.uid,
      data.move,
      data.roomCode
    );
    this.server.to(String(data.roomCode)).emit('player-moved', c4);
    return c4;
  }

  @SubscribeMessage('create-room')
  async createRoom(@ConnectedSocket() client: Socket): Promise<Room> {
    const room: Room = await this.C4service.CreateRoom(
      client.handshake.auth.uid
    );
    client.join(String(room.id));
    return room;
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDTO
  ): Promise<ResponseDTO<Room>> {
    try {
      const room: Room = await this.C4service.JoinRoom(
        client.handshake.auth.uid,
        data.roomCode
      );
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
  ): Promise<ResponseDTO<Connect4>> {
    const game: Connect4 = await this.C4service.Replay(data.roomCode);
    this.server.to(String(data.roomCode)).emit('replay');
    return {
      data: game,
    };
  }
}
