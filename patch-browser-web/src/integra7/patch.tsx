import { IntegraIds } from "./ids";

export interface IPatch {
    id: number;
    name: string;
    msb: number;
    lsb: number;
    pc: number;
    category: string
    type: string
    extension: string
}