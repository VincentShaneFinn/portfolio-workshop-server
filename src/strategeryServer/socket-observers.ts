import { IObserver } from './../domain/interfaces/observers/IObserver';
import { STRATEGERY_EVENTS } from './../domain/strategery/STRATEGERY_EVENTS';
import { ISubject } from './../domain/interfaces/observers/ISubject';
import { StrategerySocketProps } from "./socket-props";
export class StategerySocketObservers {
    public get serverProps() { return this.socketProps.serverProps; }    

    private lobbyEvents: Record<string, [ISubject, IObserver]> = {};
    
    constructor(private socketProps: StrategerySocketProps) {
        this.lobbyEvents[STRATEGERY_EVENTS.players_changed] = [this.serverProps.lobby.playersChangedEvent, new OnPlayersChanged(this.socketProps)];
        this.lobbyEvents[STRATEGERY_EVENTS.host_changed] = [this.serverProps.lobby.hostChangedEvent, new OnHostChanged(this.socketProps)];
        this.lobbyEvents[STRATEGERY_EVENTS.all_disconnected] = [this.serverProps.lobby.allDisconnectedEvent, new OnAllDisconnected(this.socketProps)];
    }
    
    attachAll() {
        for(const [_, value] of Object.entries(this.lobbyEvents)) {
            value[0].attach(value[1]);
        }
    }

    detachAll() {
        for(const [_, value] of Object.entries(this.lobbyEvents)) {
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