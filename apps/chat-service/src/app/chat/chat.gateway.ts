import {
    WebSocketGateway,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type MessageDTO = {
    game: string, //not sure if this one will be needed (must discuss further tomorrow)
    roomCode: number | null,
    message: string | null
}

const port = 8000;
@WebSocketGateway(
    port,
    {
        cors:{
            origin: '*',
            credentials: true,
            allowedHeaders: true
        }
    }
)
export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect{
    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        /* 
        nestjs default gateway function
        */
        console.log('WebSocket chat server running on port: ', port);
    }
    
    handleConnection(client: Socket) {
        /* 
        nestjs default gateway function
        do nothing lol
        */
        console.log("Client ", client.id, " has connected")
    }

    handleDisconnect(client: Socket) {
        /* 
        Removes the client indicated by <client> from the chat room they are in (if in any),
        otherwise do nothing
        */
       console.log("Client ", client.id, " has disconnected")
    }

    @SubscribeMessage('join')
    handleJoin(@ConnectedSocket() client:Socket, @MessageBody() data: MessageDTO){
        /* 
        Attempts to join the room found in <data>
        If room does not exist, create a new one then join it
        */
    }

    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client:Socket, @MessageBody() data: MessageDTO){
        /* 
        Sends the message in <data> to the room found in <data> if it room exists
        */
       
    }
}