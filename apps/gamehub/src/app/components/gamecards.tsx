import { GameInfo } from "../types/gameInfo";
import { Link } from "react-router-dom";

//TODO: display image to the game
export function gameCard(game: GameInfo){
    const temp = "../temporaryassets/tempimage.jpg";
    return(
        <span key={game.gid} 
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
            }}>
            {/*TODO: figure out a way to dynamically display the image based on game.thumbnail*/}
            <Link to="/gamehub/tictactoe">
                <img src={require('../temporaryassets/tempimage.jpg')} alt=""  style={{height:100, width: 100}}/>
            </Link>
            <div>
                [{game.name}, {game.description}]
            </div>
        </span>
    );
}