import { IPatch } from "../integra7/patch";

const baseUrl = process.env.REACT_APP_ENDPOINT_URL;

export async function getPatches(): Promise<IPatch[]> {
    return (await fetch(`${baseUrl}/api/patches`)).json();
}

export async function setPatch(channel: number, id: number): Promise<void> {
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