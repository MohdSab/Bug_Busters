import { Socket } from 'socket.io'

export default function sendMessage(socket:Socket, roomCode:string, username:string, message:string) {
    socket?.emit('message', {roomCode:roomCode, username:username, message:message},
        (res: {error: any, data:any }) => {
            if (!res.data) {
                console.error(res?.error);
                return;
            }
        }
    )
}