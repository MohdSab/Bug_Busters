export default async function createRoom(game: string, gameRoomID: number) {
    const response = await fetch('http://localhost:4000/chat',
        {method: 'POST',
        body: JSON.stringify({game:game, gameRoomID:gameRoomID})}
    );
    if (!response.body) {console.error('there was probably an error creating a room...'); return;}
    return response.body;
}