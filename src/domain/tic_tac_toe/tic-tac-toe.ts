import { BaseSubject } from './../observers/base-subject';
import { ISubject } from './../interfaces/observers/ISubject';
export class TicTacToe {
    selectedTile: Array<number>;
    currentPlayer: string;
    ticTacToeTurn: ISubject = new BaseSubject();

    setPlayers(players: string[]) {
        this.currentPlayer = players[0];
        this.ticTacToeTurn.notify();
    }

    selectTile(player: string, x: number, y: number) {
        if (player !== this.currentPlayer) return;
        this.selectedTile = [x, y];
    }
}