import { GameInfo } from '../types/gameInfo';
import { Link } from 'react-router-dom';

interface Props extends GameInfo {}

//TODO: display image to the game
export function GameCard({ name, description, gid, thumbnail, url }: Props) {
  return (
    <Link target="blank" to={url}>
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={thumbnail} alt="" style={{ height: 200, width: 200 }} />
          <div>
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
