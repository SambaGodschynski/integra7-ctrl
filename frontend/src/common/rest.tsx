import { IPatch } from "../integra7/patch";

const baseUrl = process.env.REACT_APP_ENDPOINT_URL;

export async function getPatches(): Promise<IPatch[]> {
    return (await fetch(`${baseUrl}/api/patches`)).json();
}