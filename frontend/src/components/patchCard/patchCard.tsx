import './patchCard.css';
import { IPatch } from '../../integra7/patch';

export const PatchCard = function(props: {patch: IPatch|undefined}) {
    return (<div className="patch-card">
        <h3>{props.patch?.name}</h3>
        <code>instrumentDef: "{props.patch?.name}" _bankLsb={props.patch?.lsb} _bankMsb={props.patch?.msb} _pc={(props.patch?.pc ?? 0)-1};</code>
    </div>);
}