import "./integraControl.css";
import { IValueControlProps } from "../valueControl/valueControl";
import { IntegraParameter } from "../../../integra7/parameters";
import { ValueControl } from "../valueControl/valueControl";
import { IntegraIds } from "../../../integra7/ids";
import { getIntegra7 } from "../../../integra7/communicationServer";

export interface IntegraControlProps extends IValueControlProps {
    parameter: IntegraParameter;
    partId: number;
}

export function IntegraControl (props: IntegraControlProps) {
    const onValueChanged = async (v: number|null) => {
        if (v===null) {
            return;
        }
        const integra = await getIntegra7();
        await integra.setValue({
            address: IntegraIds.PRM + IntegraIds._PRF + props.partId + props.parameter.addr,
            value: v
        });
    };

    return (<>
        <ValueControl value={0} onChange={onValueChanged}></ValueControl>
    </>);
}