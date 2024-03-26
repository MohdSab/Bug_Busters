import { Gateway } from '@bb/gateway-lib';

export async function createRoom(game: string, gameRoomID: number, service_key: string, gateway_host:string){
   
    console.log("before gateway");
    const gateway = new Gateway(gateway_host)
    console.log("after gateway");
    console.log("in create room function from ttt, sending request");
    return gateway.SendRequest(
        service_key, 
        'api/chat',
        {method: 'POST', body: JSON.stringify({game:game, gameRoomID:gameRoomID})}
    ).then((res) => {
        console.log("request finished sending, return code of request is", res.status);
        if(!res.body){
            console.error('smthing wrong with creating a room');
            return;
        }
        return res.body;
    })

    //const response = await fetch('http://localhost:3000',
    //    {method: 'POST',
    //    body: JSON.stringify({game:game, gameRoomID:gameRoomID})}
    //);
    //if (!response.body) {console.error('there was probably an error creating a room...'); return;}
    //return response.body;
}