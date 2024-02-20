import { GameInfo } from '../types/gameInfo';
import { Link } from 'react-router-dom';

interface Props extends GameInfo {}

//TODO: display image to the game
export function GameCard(props: Props) {
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/*TODO: figure out a way to dynamically display the image based on game.thumbnail*/}
      <Link to={props.url}>
        <img
          src={props.thumbnail}
          alt=""
          style={{ height: 100, width: 100 }}
        />
      </Link>
      <div>
        [{props.name}, {props.description}]
      </div>
    </span>
  );
}
