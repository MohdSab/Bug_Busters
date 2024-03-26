// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import styles from './games.module.css';
import { GameInfo } from '../types/gameInfo';
import { useGateway } from '@bb/gateway-hook-lib';
import { GameCard } from '../components/GameCards';

function GameHub() {
  //states
  const { getService, getHost } = useGateway();
  const [games, setGames] = useState<GameInfo[]>([]);

  //obtain all games from database, determine row and game numbers
  useEffect(() => {
    getService(process.env.NX_GAME_SERVICE || 'game-service')
      .then((route) => {
        if (route) {
          return fetch(
            `http://${getHost() || 'localhost:3000'}${
              route.endpoint || '/proxy/game-service'
            }/game`
          );
        } else {
          throw new Error('Cannot get gane service');
        }
      })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setGames(res);
      })
      .catch(console.error);
  }, [getHost]);

  return (
    <div>
      <h1>Pick a Game to Play:</h1>
      <div className={styles['game-list']}>
        {games.map((game, i) => (
          <GameCard {...game} key={`${game.name}-${i}`} />
        ))}
      </div>
    </div>
  );
}

export default function GameHubPage() {
  return (
    <div>
      <GameHub />
    </div>
  );
}
