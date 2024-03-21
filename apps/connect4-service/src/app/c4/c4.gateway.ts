import {
    WebSocketGateway,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayInit,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connect4Service } from './c4.service';

//TODO: declare dto's
type MessageDTO = {
    roomCode: number | null;
    move: number | null;
}

const port = +process.env.WS_PORT || 8001;

@WebSocketGateway(port, {
    path: '/c4',
    cors: {
        origin: '*',
        credentials: true,
        allowedHeaders: true
    }
})
export class Connect4Gateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect{
    @WebSocketServer()
    server: Server;

    //TODO: put connect4 service as parameter to constructor for nestjs to handle dependency    
    constructor(service: Connect4Service){}

    handleConnection(client: Socket) {
        console.log('client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('client disconnected:', client.id);
        //TODO: stuff
    }

    afterInit(server: Server) {
        console.log("WS server is running on port:", port);
    }

    @SubscribeMessage('move')
    handleMove(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDTO){

    }

    @SubscribeMessage('create-room')
    handleCreate(@ConnectedSocket() client: Socket){

    }

    @SubscribeMessage('join-room')
    handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDTO){

    }

    @SubscribeMessage('replay')
    handleReplay(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDTO){

    }
}