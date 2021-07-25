import { IObserver } from './../domain/interfaces/observers/IObserver';
import { STRATEGERY_EVENTS } from './../domain/strategery/STRATEGERY_EVENTS';
import { ISubject } from './../domain/interfaces/observers/ISubject';
import { StrategerySocketProps } from "./socket-props";
export class StategerySocketObservers {
    public get serverProps() { return this.socketProps.serverProps; }    

    private events: Record<string, [ISubject, IObserver]> = {};
    
    constructor(private socketProps: StrategerySocketProps) {
        this.events[STRATEGERY_EVENTS.players_changed] = [this.serverProps.lobby.playersChangedEvent, new OnPlayersChanged(this.socketProps)];
        this.events[STRATEGERY_EVENTS.host_changed] = [this.serverProps.lobby.hostChangedEvent, new OnHostChanged(this.socketProps)];
        this.events[STRATEGERY_EVENTS.all_disconnected] = [this.serverProps.lobby.allDisconnectedEvent, new OnAllDisconnected(this.socketProps)];

        this.events["turn"] = [this.serverProps.tictactoe.ticTacToeTurn, new OnTicTacToeTurn(this.socketProps)];
        this.events["game-end"] = [this.serverProps.tictactoe.gameEnd, new OnGameEnd(this.socketProps)];
    }
    
    attachAll() {
        for(const [_, value] of Object.entries(this.events)) {
            value[0].attach(value[1]);
        }
        
    }

    detachAll() {
        for(const [_, value] of Object.entries(this.events)) {
            value[0].detach(value[1]);
        }
    }
}

class BaseEvent {
    constructor(protected socketProps: StrategerySocketProps) {}
}

class OnPlayersChanged extends BaseEvent implements IObserver {
    update(): void {
        this.socketProps.socket.emit("players-changed", this.socketProps.serverProps.lobby.players);
    }
}

class OnHostChanged extends BaseEvent implements IObserver {
    update(): void {
        this.socketProps.socket.emit("host-changed", this.socketProps.serverProps.lobby.host);
    }
}

class OnAllDisconnected extends BaseEvent implements IObserver {
    update(): void {
        if (this.socketProps.serverProps.lobby.players.length == 0) this.socketProps.serverProps.initialize();
    }
}

class OnTicTacToeTurn extends BaseEvent implements IObserver {
    update(): void {
        console.log(this.socketProps.serverProps.tictactoe.board);
        this.socketProps.socket.emit("tic-tac-toe-turn", { 
            board: this.socketProps.serverProps.tictactoe.board,
            currentPlayer: this.socketProps.serverProps.tictactoe.currentPlayer
        })
    }
}

class OnGameEnd extends BaseEvent implements IObserver {
    update(): void {
        this.socketProps.socket.emit("game-end", { 
            winningPlayer: this.socketProps.serverProps.tictactoe.winningPlayer
        })
    }
}