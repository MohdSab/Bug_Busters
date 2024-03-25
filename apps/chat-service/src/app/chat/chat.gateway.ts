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
    username: string //name of the user
    message: string | null
}

type ResponseDTO<T> = {
    error? : null,
    data: T
}

const port = 9000;
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
        Removes the user indicated by <client> from the chat room(s) they are in (if in any),
        otherwise do nothing
        */
       console.log("Client ", client.id, " has disconnected");
       const uid = client.handshake.auth.id;
       const leftRooms: string[] = this.chatService.leaveAllRooms(uid);
       //notify every room user was in that they have left
        leftRooms.forEach((room) => this.server.to(room).emit('user-left', uid));
    }

    @SubscribeMessage('join')
    onJoin(@ConnectedSocket() client:Socket, @MessageBody() data: MessageDTO): ResponseDTO<boolean>{
        /* 
        Attempts to join the room found in <data>
        Returns true on successful join
        Returns false on invalid roomcode
        */

        try{
            const res = this.chatService.joinRoom(client.handshake.auth.uid ,data.roomCode);
            client.join(data.roomCode);
        }
        catch (err){
            return {
                error: err,
                data: false
            };
        }
        return {
            data: true
        };
    }

    @SubscribeMessage('message')
    onMessage(@ConnectedSocket() client:Socket, @MessageBody() messageData: MessageDTO): ResponseDTO<MessageDTO>{
        /* 
        Sends the message in <data> to the room found in <data> if the room exists
        */ 
        try{
            this.chatService.ExceptRoomExists(messageData.roomCode); //check room exists
            this.chatService.checkUserInRoom(client.handshake.auth.uid, messageData.roomCode) //check user in room
            this.server.to(messageData.roomCode).emit('message-received', messageData);
            return {
                data: messageData
            }
        } 
        catch(err){
            return {
                error: err,
                data: null
            }  
        }
    }
}