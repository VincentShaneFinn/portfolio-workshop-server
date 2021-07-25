import { BaseSubject } from './../observers/base-subject';
import { ISubject } from './../interfaces/observers/ISubject';
export class TicTacToe {
    currentCharacter = "X";
    currentPlayer: string;
    otherPlayer: string;
    winningPlayer: string;
    ticTacToeTurn: ISubject = new BaseSubject();
    gameEnd: ISubject = new BaseSubject();
    board: Record<number, Record<number, string>>;

    constructor() {
        this.board = {};
        for (let i = 0; i < 3; i++) {
            this.board[i] = {};
            for (let j = 0; j < 3; j++) {
                this.board[i][j] = " ";
            }
        }
    }

    setPlayers(players: string[]) {
        this.currentPlayer = players[0];
        this.otherPlayer = players[1];
        this.ticTacToeTurn.notify();
    }

    selectTile(player: string, x: number, y: number) {
        if (player !== this.currentPlayer) return;
        this.board[y][x] = this.currentCharacter;

        this.checkForWin();
        if (!this.gameEnded()) {
            let otherPlayerTemp = this.otherPlayer;
            this.otherPlayer = this.currentPlayer;
            this.currentPlayer = otherPlayerTemp;

            if (this.currentCharacter === "X") this.currentCharacter = "O";
            else this.currentCharacter = "X";
            
            this.ticTacToeTurn.notify();
        }
    }

    gameEnded(): boolean {
        return this.winningPlayer !== undefined;
    }

    checkForWin(): void {
        let _this = this;
        if (
            this.areSameString(b(0, 0), b(1, 0), b(2, 0)) ||
            this.areSameString(b(0, 1), b(1, 1), b(2, 1)) ||
            this.areSameString(b(0, 2), b(1, 2), b(2, 2)) ||
            this.areSameString(b(0, 0), b(0, 1), b(0, 2)) ||
            this.areSameString(b(1, 0), b(1, 1), b(1, 2)) ||
            this.areSameString(b(2, 0), b(2, 1), b(2, 2)) ||
            this.areSameString(b(0, 0), b(1, 1), b(2, 2)) ||
            this.areSameString(b(0, 2), b(1, 1), b(2, 0))
        ) {
            this.winningPlayer = this.currentPlayer;
            this.gameEnd.notify();
        }

        function b(x: number, y: number): string {
            return _this.board[y][x];
        }
    }

    areSameString(s1: string, s2: string, s3: string) {
        if (s1 !== " ")
            return s1 === s2 && s2 === s3;
    }
}