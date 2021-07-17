import { StrategeryLobby } from "../domain/strategery/strategery-lobby";
import { GetNextPlayerName } from "../domain/utils/getNextPlayerName";

export class StrategeryServerProps {
    lobby: StrategeryLobby;
    getNextPlayerName: GetNextPlayerName;

    constructor() {
        this.initialize();
    }

    initialize(): StrategeryServerProps {
        this.lobby = new StrategeryLobby();
        this.getNextPlayerName = new GetNextPlayerName();

        return this;
    }
}
