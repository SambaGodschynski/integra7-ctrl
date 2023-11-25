import { IPatch } from "../../integra7/patch";
import { IntegraControl } from "../controls/integraControl/integraControl";
import { ValueControl } from "../controls/valueControl/valueControl";
import { StudioSetPart } from "../../integra7/parameters";
import { IntegraIds } from "../../integra7/ids";
import "./patchEditor.css";

export const PatchEditor = function (props: {patch: IPatch|undefined}) {
    const volume = StudioSetPart[IntegraIds.NEFP_LEVEL];
    return (<>
        <IntegraControl parameter={volume}></IntegraControl>
    </>);
}