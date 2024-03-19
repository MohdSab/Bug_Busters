// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';

function EmptyCell() {
  return <div className={styles.emptyCell} />;
}

function P1Cell() {
  return <div className={styles.p1Cell} />;
}

function P2Cell() {
  return <div className={styles.p2Cell} />;
}

function Butt({ onClick }: { onClick: () => void }) {
  return <div onClick={onClick}>Butt</div>;
}

const initalState: number[][] = Array(6).fill(Array(7).fill(0));

export function App() {
  const [board, setBoard] = useState(initalState);
  const [isP1, setIsP1] = useState(true);

  const [something, fkoff] = useState<number | null>(null);

  // Read about useEffect

  // Read ttt for how to use Auth service and websocket context

  // Design the action flow

  // console.log

  const handleClick = (col: number) => {
    if (isP1) {
      setIsP1(false);

      setIsP1((old) => !old);

      setBoard((old) => {
        const newBoard = [...old];
        newBoard[3][col] = isP1 ? 1 : 2;
        return newBoard;
      });
    }

    console.log('P' + isP1 + ' Clicked on row ' + col);
    setIsP1((old) => !old);

    // Animations and stuff
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Connect 4</h1>

      <div id={styles.board}>
        <div id={styles.buttons}>
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <Butt key={`button-${i}`} onClick={() => handleClick(i)} />
            ))}
        </div>
        {board.map((row, i) => (
          <div className={styles.row} key={`row-${i}`}>
            {row.map((cell, j) => (
              <>
                {cell === 0 ? (
                  <EmptyCell key={`cell-${i + j}`} />
                ) : cell === 1 ? (
                  <P1Cell key={`cell-${i + j}`} />
                ) : (
                  <P2Cell key={`cell-${i + j}`} />
                )}
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
