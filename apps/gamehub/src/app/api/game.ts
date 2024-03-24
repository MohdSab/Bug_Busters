import { GameInfo } from "../types/gameInfo";

export async function getAllGames(): Promise<GameInfo[]>{
    /*
    Return an array containing information related to every game currently available to the user 
    */
    const host = 'localhost';
    const globalPrefix = 'api';
    const port = 3000;
    let data:GameInfo[] = [];
    //TODO: host,port, endpoint ARE PROBABLY NOT CORRECT, read on nestjs and fix
    //call get request to obtain information on all games
    const response = await fetch('http://' + host + ':' + port + '/api/game');
    //
    data = await response.json();

    //temp data to see if it works on local machine
    /*data = [
        {gid: 1, name: 'chess', description: 'chess', thumbnail: '../temporaryassets/tempimage.jpg', url: '/chess'},
        {gid: 2, name: 'tictactoe', description: 'tictactoe', thumbnail: '../temporaryassets/tempimage.jpg', url: '/tictactoe'},
        {gid: 3, name: 'gomoku', description: 'gomoku', thumbnail: '../temporaryassets/tempimage.jpg', url: '/gomoku'},
        {gid: 4, name: 'connect4', description: 'connect4', thumbnail: '../temporaryassets/tempimage.jpg', url: '/connect4'},
        {gid: 5, name: 'go', description: 'go', thumbnail: '../temporaryassets/tempimage.jpg', url: '/go'},
        {gid: 6, name: 'whatever', description: 'whatever', thumbnail: '../temporaryassets/tempimage.jpg', url: '/whatever'},

    ];*/
    return data;
}

function getGame(gid: number): GameInfo{
    /*
    Returns the game information related to the game which has id corresponding to gid
    */
   //TODO
   const temp:GameInfo = {gid: 1, name: 'tempname', description: 'tempdesc', thumbnail: 'pathtoimg', url: 'tempurl'};
   return temp;
}