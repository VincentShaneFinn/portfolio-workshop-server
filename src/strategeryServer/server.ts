import { StrategerySocketProps } from './socket-props';
import { Express } from "express-serve-static-core";
import { Socket } from 'socket.io';
import { StategerySocketObservers } from './socket-observers';
import { StrategeryServerProps } from './server-props';

export class StrategeryServer {
    start(app: Express, io: any) {
        let serverProps = new StrategeryServerProps();

        io.on('connection', (socket: Socket) => {
            let socketProps = new StrategerySocketProps(serverProps, socket, io);
            let socketObservers = new StategerySocketObservers(socketProps);
            
            socketObservers.attachAll();

            console.log(`${socketProps.playerName} connected`);

            socket.on("join-game", () => {
                socket.emit("join-game", socketProps.playerName);
            })

            socket.on("joined-lobby", () => {
                serverProps.lobby.addPlayer(socketProps.playerName);
            })

            socket.on("start-game", () => {
                io.emit("load-game");
            });

            socket.on("loaded-game", () => {
                serverProps.loadedPlayers++;
                if(serverProps.loadedPlayers === 2) {
                    serverProps.tictactoe.setPlayers(serverProps.lobby.players);
                }
            });

            socket.on("select-tile", (data: any) => {
                serverProps.tictactoe.selectTile(data.playerName, data.x, data.y);
            });

            socket.on("disconnect", () => {
                console.log(`${socketProps.playerName} disconnected`);
                serverProps.lobby.removePlayer(socketProps.playerName);
                socketObservers.detachAll();
            })
        });
    }
}