import { Socket } from "socket.io";
import { StrategeryServerProps } from "./server-props";

export class StrategerySocketProps {
    public playerName: string;
    constructor (
        public serverProps: StrategeryServerProps, 
        public socket: Socket, 
        public io: Socket
        ){ 
            this.playerName = serverProps.getNextPlayerName.call();
        }
}