import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Connect4 {
  @PrimaryGeneratedColumn()
  gid: number;

  @Column('char', { array: true })
  board: string[][];

  @Column()
  player1: number; // uid

  @Column()
  player2: number; // uid

  @Column()
  player1IsPlaying: boolean;

  @Column()
  winner: string | null;

  constructor() {
    this.board = [
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '']
    ];
    this.player1 = null;
    this.player2 = null;
    this.player1IsPlaying = true; // assume player1 is the first player
    this.winner = null;
  }

  SetPlayer1(player1: number) {
    this.player1 = player1;
  }

  SetPlayer2(player2: number) {
    this.player2 = player2;
  }

  MakeMove(currentPlayer: number, ind: number) {
    if (this.player1IsPlaying && currentPlayer == this.player1) {
      for (let i = 0; i < 5; i++) {
        if (this.board[i][ind] == '') {
          this.board[i][ind] = 'x';
          this.player1IsPlaying = false;
          let result = this.CheckWin();
          if (result != null) {
            this.winner = 'x';
          }
          return result;
        }
      } 
    } else if (!this.player1IsPlaying && currentPlayer == this.player2) {
      for (let i = 0; i < 5; i++) {
        if (this.board[i][ind] == '') {
          this.board[i][ind] = 'o';
          this.player1IsPlaying = true;
          let result = this.CheckWin();
          if (result != null) {
            this.winner = 'o';
          }
          return result;
        }
      }
    }
    return null;
  }

  // returns winning tuple if someone wins, null otherwise
  CheckWin() {

    // vertical
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.board[y][x] !== '' &&
            this.board[y][x] === this.board[y+1][x] &&
            this.board[y][x] === this.board[y+2][x] &&
            this.board[y][x] === this.board[y+3][x]) {
          return [[y, x], [y+1, x], [y+2, x], [y+3, x]];
        }
      }
    }

    // horizontal
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 6; y++) {
        if (this.board[y][x] !== '' &&
            this.board[y][x] === this.board[y][x+1] &&
            this.board[y][x] === this.board[y][x+2] &&
            this.board[y][x] === this.board[y][x+3]) {
          return [[y, x], [y, x+1], [y, x+2], [y, x+3]];
        }
      }
    }

    // diagonal (up left to down right)
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.board[y][x] !== '' &&
        this.board[y][x] === this.board[y+1][x+1] &&
        this.board[y][x] === this.board[y+2][x+2] &&
        this.board[y][x] === this.board[y+3][x+3]) {
          return [[y, x], [y+1, x+1], [y+2, x+2], [y+3, x+3]];
        }
      }
    }

    // diagonal (up right to down left)
    for (let x = 3; x < 6; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.board[y][x] !== '' &&
        this.board[y][x] === this.board[y+1][x-1] &&
        this.board[y][x] === this.board[y+2][x-2] &&
        this.board[y][x] === this.board[y+3][x-3]) {
          return [[y, x], [y+1, x-1], [y+2, x-2], [y+3, x-3]];
        }
      }
    }
    return null;
  }

  ResetBoard() {
    this.board = [
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '']
    ];
    this.player1IsPlaying = true;
    this.winner = null;
  }
}
