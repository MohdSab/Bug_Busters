import { Socket } from 'socket.io-client'
import ResponseDTO from '../types/Response';

export function joinRoom(socket:Socket | null, roomCode:string, username:string | undefined) {
    if (!socket || !username) return;
    
    socket?.emit('join', {roomCode: roomCode, username:username}, 
        (res: ResponseDTO<string>) => {
            if (!res.data) {
                console.error(res?.error);
                return;
            }
        }
    )
}
