// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useEffect, useState } from 'react';
import { getAllGames } from '../api/game';
import { GameInfo } from '../types/gameInfo';
import { Navbar } from '../components/Navbar';
import { gameCard } from '../components/gamecards';
import { gameList } from '../components/gamelist';

function MakeRows(games: GameInfo[], numGames: number, numRows: number): GameInfo[][]{
  /*
  Returns an empty 2d array with the correct amount of entries for the games provided
  Each row contains at most four games
  */
  let rows:GameInfo[][] = [];
  for(let i = 0; i < numRows; i++){
    let row:GameInfo[] = [];
    let j:number = 0;
    while(j < 4 && (i*4) + j < numGames){
      //each row contains 4 games
      row[j] = games[(i*4)+j];
      j+=1;
    }
  rows.push(row);
  }
  return rows;
}

function GameHub(){
  //states
  const [games, setGames] = useState<GameInfo[]>([]);
  let tempRows:GameInfo[][] = [];
  const [rows, setRows] = useState<Array<Array<GameInfo>>>([]);

  //obtain all games from database, determine row and game numbers
  useEffect(
    () => {[]
      getAllGames().then(result => {
      // NOTE: can not use states here, since it uses the state values on the initial render 
      //(setting the states and using them wont work because it would need to rerender the whole 
      //page and the states would not have been updated for useEffect)
        setGames(result);
        const numGamesTemp = result.length;
        const numRowsTemp:number = (result.length%4 === 0) ? result.length/4 : Math.floor(result.length/4 + 1);
        //create the rows and update rows state
        setRows(MakeRows(result, numGamesTemp, numRowsTemp));
      })
    }, []);

    //convert state into JSX to display
    const gameGrid = rows.map((currRow, rowNum) => {return gameList(currRow, rowNum)});

    //render rows of games
    return (
      <div>
        <h1>Pick a Game to Play:</h1>
        <div>
          {gameGrid}
        </div> 
      </div>
    );
}

export default function GameHubPage() {
  return (
    <div>
      <Navbar />
      <div>
        <GameHub/>
      </div>
    </div>
  );
}
