import React, { useMemo, useState } from 'react';
import styles from './room.module.css';
import { useParams } from 'react-router';
import { useAccount } from '@bb/auth-hook-lib';

type Props = {};

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
  return (
    <div className={styles['butt-container']}>
      <div onClick={onClick} className={styles['drop-button']}></div>
    </div>
  );
}

const initalState: number[][] = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

function Board({ board }: { board: number[][] }) {
  return board.map((row, i) => (
    <div className={styles.row} key={`row-${i}`}>
      {row.map((cell, j) => (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <React.Fragment key={`cell-${i * 6 + j}`}>
          {cell === 0 ? (
            <EmptyCell key={`cell-${i + j}`} />
          ) : cell === 1 ? (
            <P1Cell key={`cell-${i + j}`} />
          ) : (
            <P2Cell key={`cell-${i + j}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  ));
}

function fallTo(board: number[][], col: number) {
  for (let i = 5; i >= 0; i--) {
    if (board[i][col] === 0) return i;
  }

  throw new Error('Invalid move');
}

export default function Room({}: Props) {
  const { id } = useParams();
  const { account, loading } = useAccount();
  const [board, setBoard] = useState(initalState);
  const [isP1, setIsP1] = useState(true);
  // const [room, setRoom] = useState({
  //   id: Number(id),
  //   player1:
  // });

  const handleClick = (col: number) => {
    try {
      const row = fallTo(board, col);
      const player = isP1 ? 1 : 2;
      setBoard((old) => {
        old[row][col] = player;

        return old;
      });

      setIsP1((old) => !old);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Connect 5</h1>

      <div className={styles.game}>
        <div className={styles['side-bar']}>something</div>
        <div id={styles.board}>
          <div id={styles.buttons}>
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Butt key={`button-${i}`} onClick={() => handleClick(i)} />
              ))}
          </div>
          <Board board={board} />
        </div>
      </div>
    </div>
  );
}
