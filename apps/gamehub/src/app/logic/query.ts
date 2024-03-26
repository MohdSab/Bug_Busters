import { GameInfo } from '../types';

export async function getOverviews(): Promise<GameInfo[]>{
    //determine ip/port to the gateway api
    const host = 'localhost';
    const port = '2222';
    let data:GameInfo[] = [];
    
    //const response = await fetch('http://' + host + ':' + port + '/gamehub-backend/');
    //parse response?
    //data = await response.json();
    data = [{gid: 1, name: 'chess', description: 'hello', thumbnail: 'world', url: 'temp'}];
    return data;
}