import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Connect4 {
  @PrimaryGeneratedColumn()
  gid: number;

  @Column({ nullable: true })
  rid: number;

  @Column('char', { array: true })
  board: string[][];

  @Column({ nullable: true })
  player1?: number; // uid

  @Column({ nullable: true })
  player2?: number; // uid

  @Column()
  player1IsPlaying: boolean;

  @Column({ nullable: true })
  winner: string | null;

  constructor() {
    this.board = [
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
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
    if (this.winner !== null) return;
    if (this.player1IsPlaying && currentPlayer == this.player1) {
      console.log("Player 1 make move!!!!");
      console.log(this.board);
      for (let i = 5; i >= 0; i--) {
        // I KNOW THIS IS A SPACE!! FOR SOME REASON, PSQL USES SPACES. SO STUPID.
        if (this.board[i][ind] == ' ') {
          console.log("Thing is make happen !");
          this.board[i][ind] = 'x';
          this.player1IsPlaying = false;
          const result = this.CheckWin();
          if (result != null) {
            this.winner = 'x';
          }
          return result;
        }
      }
    } else if (!this.player1IsPlaying && currentPlayer == this.player2) {
      console.log("Player 2 make move!!!");
      for (let i = 5; i >= 0; i--) {
        if (this.board[i][ind] == ' ') {
          this.board[i][ind] = 'o';
          this.player1IsPlaying = true;
          const result = this.CheckWin();
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
      for (let y = 0; y < 3; y++) {
        if (
          this.board[y][x] !== ' ' &&
          this.board[y][x] === this.board[y + 1][x] &&
          this.board[y][x] === this.board[y + 2][x] &&
          this.board[y][x] === this.board[y + 3][x]
        ) {
          return [
            [y, x],
            [y + 1, x],
            [y + 2, x],
            [y + 3, x],
          ];
        }
      }
    }

    // horizontal
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 6; y++) {
        if (
          this.board[y][x] !== ' ' &&
          this.board[y][x] === this.board[y][x + 1] &&
          this.board[y][x] === this.board[y][x + 2] &&
          this.board[y][x] === this.board[y][x + 3]
        ) {
          return [
            [y, x],
            [y, x + 1],
            [y, x + 2],
            [y, x + 3],
          ];
        }
      }
    }

    // diagonal (up left to down right)
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (
          this.board[y][x] !== ' ' &&
          this.board[y][x] === this.board[y + 1][x + 1] &&
          this.board[y][x] === this.board[y + 2][x + 2] &&
          this.board[y][x] === this.board[y + 3][x + 3]
        ) {
          return [
            [y, x],
            [y + 1, x + 1],
            [y + 2, x + 2],
            [y + 3, x + 3],
          ];
        }
      }
    }

    // diagonal (up right to down left)
    for (let x = 3; x < 6; x++) {
      for (let y = 0; y < 3; y++) {
        if (
          this.board[y][x] !== ' ' &&
          this.board[y][x] === this.board[y + 1][x - 1] &&
          this.board[y][x] === this.board[y + 2][x - 2] &&
          this.board[y][x] === this.board[y + 3][x - 3]
        ) {
          return [
            [y, x],
            [y + 1, x - 1],
            [y + 2, x - 2],
            [y + 3, x - 3],
          ];
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
      ['', '', '', '', '', '', ''],
    ];
    this.player1IsPlaying = true;
    this.winner = null;
  }
}
