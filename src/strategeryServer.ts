import { IObserver } from './domain/interfaces/observers/IObserver';
import { GetNextPlayerName } from './domain/utils/getNextPlayerName';
import { StrategeryLobby } from './domain/strategery/strategery-lobby';
import { Express } from "express-serve-static-core";
import { Socket } from 'socket.io';
import { ISubject } from './domain/interfaces/observers/ISubject';

class SocketObservers {
    private props: StrategeryServerProps

    private onAllDisconnected: OnAllDisconnected;
    private onPlayersChanged: OnPlayersChanged;
    private onHostChanged: OnHostChanged;
    
    constructor(private socket: Socket) {
    }

    initialize(props: StrategeryServerProps): SocketObservers {
        this.props = props;

        this.onAllDisconnected = new OnAllDisconnected(this.props, this);
        this.onPlayersChanged = new OnPlayersChanged(this.props, this.socket);
        this.onHostChanged = new OnHostChanged(this.props, this.socket);

        return this;
    }
    
    attachAll() {
        this.props.lobby.allDisconnectedEvent.attach(this.onAllDisconnected);
        this.props.lobby.playersChangedEvent.attach(this.onPlayersChanged);
        this.props.lobby.hostChangedEvent.attach(this.onHostChanged);
    }

    detachAll() {
        this.props.lobby.allDisconnectedEvent.detach(this.onAllDisconnected);
        this.props.lobby.playersChangedEvent.detach(this.onPlayersChanged);
        this.props.lobby.hostChangedEvent.detach(this.onHostChanged);
    }
}

class StrategeryServerProps {
    lobby: StrategeryLobby;
    getNextPlayerName: GetNextPlayerName;

    initialize(): StrategeryServerProps {
        this.lobby = new StrategeryLobby();
        this.getNextPlayerName = new GetNextPlayerName();

        return this;
    }
}

class OnAllDisconnected implements IObserver {
    constructor(private props: StrategeryServerProps, private socketObserver: SocketObservers) { }

    update(): void {
        if (this.props.lobby.players.length == 0) {
            this.props.initialize();
            this.socketObserver.initialize(this.props);
        }
    }
}

class OnPlayersChanged implements IObserver {
    constructor(private props: StrategeryServerProps, private socket: Socket) { }

    update(): void {
        this.socket.emit("players-changed", this.props.lobby.players);
    }
}

class OnHostChanged implements IObserver {
    constructor(private props: StrategeryServerProps, private socket: Socket) { }
    
    update(subject: ISubject): void {
        this.socket.emit("host-changed", this.props.lobby.host);
    }
}

export class StrategeryServer {
    start(app: Express, io: any) {
        let props = new StrategeryServerProps();
        props.initialize();

        io.on('connection', (socket: Socket) => {
            let socketObservers = new SocketObservers(socket).initialize(props);
            let playerName = props.getNextPlayerName.call();
            socketObservers.attachAll();

            console.log(`${playerName} connected`);

            socket.on("join-game", () => {
                socket.emit("join-game", playerName);
            })

            socket.on("joined-lobby", () => {
                props.lobby.addPlayer(playerName);
            })

            socket.on("disconnect", () => {
                console.log(`${playerName} disconnected`);
                props.lobby.removePlayer(playerName);
                socketObservers.detachAll();
            })
        });
    }
}