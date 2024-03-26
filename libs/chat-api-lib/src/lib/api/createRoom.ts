import { Gateway } from '@bb/gateway-lib';

export async function createRoom(game: string, gameRoomID: number, service_key: string, gateway_host:string){
   
    console.log("before gateway");
    const gateway = new Gateway(gateway_host)
    console.log("after gateway");
    console.log("in create room function from ttt, sending request");
    return gateway.SendRequest(
        service_key, 
        '/chat',
        {method: 'POST', headers:{'content-type': 'application/json'}, body: JSON.stringify({game:game, gameRoomID:gameRoomID})}
    ).then((res) => {
        console.log("request finished sending, return code of request is", res.status);
        if(!res.body){
            console.error('smthing wrong with creating a room');
            return;
        }
        return res.body;
    })

    /*try{
        return await fetch('http://172.18.0.5:4000/api/chat',
            {method: 'POST',
            body: JSON.stringify({game:game, gameRoomID:gameRoomID})}
        ).then((res) => {return res.body});
    }
    catch(err){
        console.error();
        console.error(err);
    }
    //if (!response.body) {console.error('there was probably an error creating a room...'); return;}
    //return response.body;*/
}