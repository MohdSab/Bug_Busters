// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useEffect, useState } from 'react';
import { getOverviews } from './logic/query';
import { GameInfo } from './types';


/*
function Game(): GameInfo{
  //note: delete games from the games object as we go
  let currGame:GameInfo = {
    gid: -1,
    name: '',
    description: '',
    thumbnail: '',
    url: ''
  };
  let allGames:string[] = Object.keys(games); //object key names for each game
  currGame.gid = ;
  return currGame;
}

function GameRows(){
  //generate and return a body containing all the rows of every game
  const numRows = (numGames % 4 === 0) ? numGames / 4:numGames / 4 + 1;
  const rows = [];
  for(let i=0; i < numRows; i++){
    let row:GameInfo[] = [];
    for(let j=0; j < 4; j++){
      row.push(Game());
    }
    rows.push(row);
  }
  return RowsContainer(rows);
}


function RowsContainer(rows: Array<Array<GameInfo>>){
  //todo: generate the body which contains all the rows
  //note: use Array.map()?
  //note: in body: need helper function to convert gameInfo to a JSX component?
  const body = rows.map(
    () => {

    }
  );
}
*/

function GameHub(){
  let numGames:number = 0;
  const [games, setGames] = useState<GameInfo[]>([]);

  useEffect(
    () => {
      getOverviews().then(res => { setGames(res); })
      //determine number of games returned
      numGames = Object.keys(games).length;
    }, []);
    console.log(games);
    const listItems = games.map(
      game => <li>{game.name}</li>
    );
    
    return (
      <div>
        <ul>{listItems}</ul>
      </div>
    );
}

export function App() {
  return (
    <div>
      <GameHub/>
    </div>
  );
}

export default App;
