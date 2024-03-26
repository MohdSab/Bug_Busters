import React, { useMemo, useState, useEffect } from 'react';
import styles from './room.module.css';
import { useParams } from 'react-router';
// import { useAccount } from '@bb/auth-hook-lib';
import { useSocket } from '@bb/socket-hook-lib';

// type Props = {};

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

const initalState: string[][] = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
];

function Board({ board }: { board: string[][] }) {
  return board.map((row, i) => (
    <div className={styles.row} key={`row-${i}`}>
      {row.map((cell, j) => (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <React.Fragment key={`cell-${i * 6 + j}`}>
          {cell === ' ' || cell === '' ? (
            <EmptyCell key={`cell-${i + j}`} />
          ) : cell === 'x' ? (
            <P1Cell key={`cell-${i + j}`} />
          ) : (
            <P2Cell key={`cell-${i + j}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  ));
}


// export default function Room({}: Props) {
export default function Room() {
  const { id } = useParams();
  const { socket, loading } = useSocket();
  // const { account, loading } = useAccount();
  const [board, setBoard] = useState(initalState);

  const [winner, setWinner] = useState('');
  const [isP1, setIsP1] = useState(true);


  function handlePlay(nextBoard: string[][]) {
    setBoard(nextBoard);
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
            if(res?.data?.board) setBoard(res.data.board);
          }
        )
      }
  }, [loading, socket, id]);

  useEffect(() => {
    console.log("Loading: " + loading);
    console.log("Socket: " + socket);
    if (loading) return;

    socket?.on('player-moved', (game) => {
      console.log(game);
      handlePlay(game.board);
      if (game.winner) {
        setWinner(game.winner);
      }
      setIsP1(game.player1IsPlaying);
    });

    socket?.on('player-joined', (room) => {
      console.log('Player joined', room);
    });

    console.log('joining room');
    console.log("Room ID:" + Number(id))
    socket?.emit('join-room', Number(id), (res: { data: any; error: any }) => {
      if (res?.error) {
        console.error(res?.error);
        return;
      }

      setBoard(res.data.currentGame.board);
    });

    return () => {
     socket?.off('player-moved');
    };
  }, [socket, loading]);

  const status = (winner === '') ? (
    <p>Next player: {isP1 ? "Blue" : "Red"}</p>
  ) : (
    <p>Winner: {winner === 'x' ? "Blue" : "Red"}</p>
  );

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Connect 5</h1>

      <div className={styles.game}>
        {/*<div className={styles['side-bar']}>something</div> */}
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

      <h1 style={{ textAlign: 'center' }}>{status}</h1>
    </div>
  );
}
