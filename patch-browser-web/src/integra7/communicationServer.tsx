import { NullLiteral } from "typescript";
import { Integra7, SetValueMessage } from "./communication";
import { IPatch } from "./patch";

const baseUrl = process.env.REACT_APP_ENDPOINT_URL;
const socketUrl = process.env.REACT_APP_SOCKET_URL as string;

export class Integra7Server implements Integra7 {

    async getPatches(): Promise<IPatch[]> {
        return (await fetch(`${baseUrl}/api/patches`)).json();
    }

    async setPatch(channel: number, id: number): Promise<void> {
        const body = {id, channel};
        const response = await fetch(`${baseUrl}/api/patch`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(body)
        });
        if (response.status === 500) {
            const msgObj = await response.json();
            alert(msgObj.message);
            return;
        }
        return response.json();
        
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