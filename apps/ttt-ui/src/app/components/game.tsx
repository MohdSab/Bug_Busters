// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './game.module.css';

import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useSocket } from '../contexts/websocket-context';

function Square({
  value,
  onSquareClick,
}: {
  value: string;
  onSquareClick: () => void;
}) {
  const textColor = value === 'x' ? styles.blue : styles.red;
  return (
    <button className={`${styles.square} ${textColor}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({
  squares,
  onPlay,
}: {
  squares: string[];
  onPlay: (squares: string[]) => void;
}) {
  const { id } = useParams();
  const { socket, loading } = useSocket();
  socket?.on("player-moved", (game) => {
    console.log(game);
    onPlay(game.board);
    if (game.winner) {
      setWinner(game.winner);
    }
    setXIsNext(game.xIsPlaying);
  })
  const [ winner, setWinner ] = useState('');
  const [ xIsNext, setXIsNext ] = useState(true);

  function handleClick(i: number) {
    if (winner !== '') return;
    socket?.emit("move", { roomCode: id, move: i });
  }
  const status = (winner !== '') ? 
    'Winner: ' + winner
  : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <>
      <h1>Tic Tac Toe</h1>
      <div className={styles.boardRow}>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className={styles.boardRow}>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className={styles.boardRow}>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <div className={styles.status}>{status}</div>
    </>
  );
}

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handlePlay(nextSquares: string[]) {
    setSquares(nextSquares);
  }

  return (
    <div className={styles.game}>
      <div className={styles.gameBoard}>
        <Board squares={squares} onPlay={handlePlay} />
      </div>
    </div>
  );
}
