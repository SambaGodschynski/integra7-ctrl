import "./integraControl.css";
import { IValueControlProps } from "../valueControl/valueControl";
import { IntegraParameter } from "../../../integra7/parameters";
import { ValueControl } from "../valueControl/valueControl";

export interface IntegraControlProps extends IValueControlProps {
    parameter: IntegraParameter;
}

export function IntegraControl (props: IntegraControlProps) {
    const onValueChanged = () => {

    }
    return (<>
        <ValueControl value={0} onChange={onValueChanged}></ValueControl>
    </>);
}