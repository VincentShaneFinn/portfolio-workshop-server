import { TicTacToe } from './../domain/tic_tac_toe/tic-tac-toe';
import { StrategeryLobby } from "../domain/strategery/strategery-lobby";
import { GetNextPlayerName } from "../domain/utils/getNextPlayerName";

export class StrategeryServerProps {
    lobby: StrategeryLobby;
    getNextPlayerName: GetNextPlayerName;
    loadedPlayers: number;
    tictactoe: TicTacToe;

    constructor() {
        this.initialize();
    }

    initialize(): StrategeryServerProps {
        this.lobby = new StrategeryLobby();
        this.getNextPlayerName = new GetNextPlayerName();
        this.loadedPlayers = 0;
        this.tictactoe = new TicTacToe();

        return this;
    }
}
