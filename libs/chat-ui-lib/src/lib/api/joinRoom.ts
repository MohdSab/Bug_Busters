import { Socket } from 'socket.io'

export default function joinRoom(socket:Socket, roomCode:string, username:string) {
    socket?.emit('join', {roomCode: roomCode, username:username}, 
        (res: {error: any, data:any }) => {
            if (!res.data) {
                console.error(res?.error);
                return;
            }
        }
    )
}
