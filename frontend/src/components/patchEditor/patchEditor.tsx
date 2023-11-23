import { IPatch } from "../../integra7/patch";
import { ValueControl } from "../controls/valueControl";
import "./patchEditor.css";

export const PatchEditor = function (props: {patch: IPatch|undefined}) {
    function onValueChanged(val: number | null): void {
        console.log(val);
    }
    return (<>
        <ValueControl value={0} onChange={onValueChanged}></ValueControl>
    </>);
}