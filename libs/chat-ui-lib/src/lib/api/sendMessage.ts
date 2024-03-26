import { Socket } from 'socket.io-client'
import ResponseDTO from '../types/Response';
import Message from '../types/message';

export default function sendMessage(socket:Socket | null, roomCode:string, username:string | undefined, message:string) {
    if (!socket || !username) return;
    
    socket?.emit('message', {roomCode:roomCode, username:username, message:message},
        (res: ResponseDTO<Message>) => {
            if (!res.data) {
                console.error(res?.error);
                return;
            }
        }
    )
}