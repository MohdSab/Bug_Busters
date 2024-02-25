// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './game.module.css';

import React from 'react';
import { useState } from 'react';
// import { calculateWinner } from './logic';
function calculateWinner(board: number[][]) {
    return null;
}

function Square({ value, onSquareClick }: { value: any, onSquareClick: () => void}) {
    const textColor = value === 'X' ? styles.blue : styles.red;
    return (
        <button className={`${styles.square} ${textColor}`} onClick={onSquareClick} >{value}</button>
    )
}

function Board({ xIsNext, squares, onPlay }: {xIsNext: boolean, squares: any, onPlay: (squares: any) => void}) {
    function handleClick(i: any) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        }   
        else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    let gif;
    if (winner) {
        status = 'Winner: ' + winner;
        gif = <img src="https://media1.tenor.com/m/67LIumILNRsAAAAd/ltg-low-tier-god.gif" alt="Winner" style={{ width: '100px', height: '100px' }}/>;
    }
    else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        gif = null;
    }

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
            {/* gif */}
        </>
    );
}

export default function TicTacToe() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares: any) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    return (
        <div className={styles.game}>
            <div className={styles.gameBoard}>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
        </div>
    );
}

