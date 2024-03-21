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
import { ChatService } from './chat.service';

type MessageDTO = {
    roomCode: string | null, //roomCode generally follows "<game name> + <gameRoomCode>"
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

    constructor(private chatService: ChatService) {}

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
        console.log("Client ", client.id, " has connected");
    }

    handleDisconnect(client: Socket) {
        /* 
        Removes the user indicated by <client> from the chat room they are in (if in any),
        otherwise do nothing
        */
       console.log("Client ", client.id, " has disconnected");
       
    }

    @SubscribeMessage('join')
    handleJoin(@ConnectedSocket() client:Socket, @MessageBody() data: MessageDTO): boolean{
        /* 
        Attempts to join the room found in <data>
        Returns true on successful join
        Returns false on invalid roomcode
        */

        //TODO: implement
        if(this.chatService.checkExists(data.roomCode)){
            client.join(data.roomCode);
            //socket id is unique but on disconnect id will change for the same user
            //(for now we are assuming that the client will not disconnect at all and if they do they
            //already lost/closed the tab of their own volition)
            this.chatService.joinRoom(client.id ,data.roomCode);
            return true;
        }
        //invalid room code
        return false;
    }

    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client:Socket, @MessageBody() data: MessageDTO){
        /* 
        Sends the message in <data> to the room found in <data> if the room exists
        */ 
        
        //TODO: implement
    }
}