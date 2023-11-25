import { NullLiteral } from "typescript";
import { Integra7, SetValueMessage } from "./communication";
import { IPatch } from "./patch";
import { Socket, io } from 'socket.io-client';

const baseUrl = process.env.REACT_APP_ENDPOINT_URL;
const socketUrl = process.env.REACT_APP_SOCKET_URL as string;

export class Integra7Server implements Integra7 {
    private socket:Socket|null = null;

    constructor() {
        this.socket = io(socketUrl);
        this.socket.on('connect', () => {
            console.log("socket connected");
        });
    }

    async getPatches(): Promise<IPatch[]> {
        return (await fetch(`${baseUrl}/api/patches`)).json();
    }

    async setPatch(channel: number, id: number): Promise<void> {
        const body = {id, channel};
        return (await fetch(`${baseUrl}/api/patch`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "POST",
              body: JSON.stringify(body)
        })).json();
    }

    async setValue(message: SetValueMessage): Promise<void> {
        console.log(message)
        this.socket!.emit('setValue', message);
    }
}

let instance:Integra7|null = null;

export async function getIntegra7(): Promise<Integra7> {
    if (instance !== null) {
        return instance;
    }
    instance = new Integra7Server();
    return instance;
}