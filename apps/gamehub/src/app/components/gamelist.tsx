import { GameInfo } from '../types/gameInfo';
import { GameCard } from './GameCards';

interface Props {
  row: GameInfo[];
  rowNum: number;
}

//TODO: use flex containers to evenly spread and center across the div
export function GameList({ row, rowNum }: Props) {
  return (
    <div
      key={rowNum}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'left',
      }}
    >
      Row Number {rowNum}
      {row.map((gInfo) => (
        <GameCard {...gInfo} key={gInfo.gid} />
      ))}
    </div>
  );
}
