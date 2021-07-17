import { BaseSubject } from './../observers/base-subject';

export class StrategeryLobby {    
    private _host: string = null;
    public get host(): string { return this._host; }
    
    private _players: Array<string> = [];
    public get players(): Array<string> { return this._players; }

    playersChangedEvent = new BaseSubject();
    hostChangedEvent = new BaseSubject();
    allDisconnectedEvent = new BaseSubject();

    addPlayer(playerName: string) {
        this._players.push(playerName);
        if (!this._host) this.promotePlayerToHost();
        this.playersChangedEvent?.notify();
    }

    removePlayer(playerName: string) {
        let foundIndex = this._players.indexOf(playerName);
        this._players.splice(foundIndex, 1);
        if (this._players.length == 0) {
            this._host = null;
            this.hostChangedEvent?.notify();
            this.allDisconnectedEvent?.notify();
        }
        else if (playerName == this._host) this.promotePlayerToHost();
        this.playersChangedEvent?.notify();
    }

    private promotePlayerToHost() {
        this._host = this._players[0];
        this.hostChangedEvent?.notify();
    }
}