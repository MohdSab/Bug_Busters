// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSocket } from '@bb/socket-hook-lib';
import styles from './game.module.css';

import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Navbar } from '@bb/auth-hook-lib';

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
  handleClick,
  status,
}: {
  squares: string[];
  handleClick: (i: number) => void;
  status: string;
}) {
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
  const { id } = useParams();
  const { socket, loading } = useSocket();
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handlePlay(nextSquares: string[]) {
    setSquares(nextSquares);
  }

  const handleClick = React.useMemo(() => {
    if (loading) return (i: number) => {};
    else
      return (i: number) => {
        console.log('clicking on ' + i);
        socket?.emit(
          'move',
          { roomCode: id, move: i },
          (res: { data: any; error?: any }) => {
            if (res.error) {
              console.error(res.error);
              return;
            }

            console.log(res.data);
            if (res?.data?.board) setSquares(res.data.board);
          }
        );
      };
  }, [loading, socket, id]);

  useEffect(() => {
    if (loading) return;

    socket?.on('player-moved', (game) => {
      console.log(game);
      handlePlay(game.board);
      if (game.winner) {
        setWinner(game.winner);
      }
      setXIsNext(game.xIsPlaying);
    });

    socket?.on('player-joined', (room) => {
      console.log('Player joined', room);
    });

    console.log('joining room');
    socket?.emit('join-room', Number(id), (res: { data: any; error: any }) => {
      if (res?.error) {
        console.error(res?.error);
        return;
      }

      setSquares(res.data.currentGame.board);
    });

    return () => {
      socket?.off('player-moved');
    };
  }, [socket, loading]);

  const [winner, setWinner] = useState('');
  const [xIsNext, setXIsNext] = useState(true);

  const status =
    winner !== ''
      ? 'Winner: ' + winner
      : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <div>
      <Navbar />
      <div className={styles.game}>
        <div className={styles.gameBoard}>
          <Board squares={squares} status={status} handleClick={handleClick} />
        </div>
      </div>
    </div>
  );
}
