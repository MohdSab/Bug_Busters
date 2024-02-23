import { Account } from './account.entity'; // TODO: somehow access the database?

export class TicTacToe {
    board: number[][];
    xPlayer: Account; // x will be -1 in the board
    oPlayer: Account; // y will be 1 in the board
    xIsPlaying: boolean;
    roomCode: number;
    gameWin: String;

    constructor(xPlayerAcc: Account, oPlayerAcc: Account, xIsFirst: boolean) {
        this.board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
        ];
        this.xPlayer = xPlayerAcc;
        this.oPlayer = oPlayerAcc;
        this.xIsPlaying = xIsFirst;
        this.roomCode = this.GenerateRoomCode();
        this.gameWin = "";
    }

    // true means a valid player made a move
    // false means a spectator tried to make a move
    MakeMove(currentPlayer: Account, row: number, col: number): boolean {
      if (this.xIsPlaying && currentPlayer == this.xPlayer) {
        this.board[row][col] = -1;
        this.xIsPlaying = false;
        if (this.CheckWin()) {
            this.gameWin = "x";
        }
        return true;
      } else if (!this.xIsPlaying && currentPlayer == this.oPlayer) {
        this.board[row][col] = 1;
        this.xIsPlaying = true;
        if (this.CheckWin()) {
            this.gameWin = "o";
        }
        return true;
      }
      return false;
    }

    GenerateRoomCode(): number {
        return 1234; // TODO
    }

    CheckWin(): boolean {
        for (let i = 0; i < 3; i++) {
          if (this.board[i][0] !== 0 &&
              this.board[i][0] === this.board[i][1] &&
              this.board[i][0] === this.board[i][2]) {
            return true;
          }
          if (this.board[0][i] !== 0 &&
              this.board[0][i] === this.board[1][i] &&
              this.board[0][i] === this.board[2][i]) {
            return true;
          }
        }
        if (this.board[0][0] !== 0 &&
            this.board[0][0] === this.board[1][1] &&
            this.board[0][0] === this.board[2][2]) {
          return true;
        }
        if (this.board[0][2] !== 0 &&
            this.board[0][2] === this.board[1][1] &&
            this.board[0][2] === this.board[2][0]) {
          return true;
        }
        return false;
      }

  }
  