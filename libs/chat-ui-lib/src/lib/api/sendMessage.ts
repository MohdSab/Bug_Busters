import { Socket } from 'socket.io'
import ResponseDTO from '../types/Response';
import Message from '../types/message';

export default function sendMessage(socket:Socket, roomCode:string, username:string, message:string) {
    socket?.emit('message', {roomCode:roomCode, username:username, message:message},
        (res: ResponseDTO<Message>) => {
            if (!res.data) {
                console.error(res?.error);
                return;
            }
        }
    )
}