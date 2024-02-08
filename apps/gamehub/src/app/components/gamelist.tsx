import { GameInfo } from "../types/gameInfo";
import { gameCard } from "./gamecards";

//TODO: use flex containers to evenly spread and center across the div
export function gameList(row: GameInfo[], rowNum: number){
    return(
        <div key={rowNum} 
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'left'
        }}>
            Row Number {rowNum}
            {row.map((gInfo) => {return gameCard(gInfo)})}
        </div>
    );
}