import { IPatch } from "./patch";

export interface SetValueMessage {
    address: number;
    value: number;
}

export interface Integra7 {
    getPatches(): Promise<IPatch[]>;
    setPatch(channel: number, id: number): Promise<void>;
}
