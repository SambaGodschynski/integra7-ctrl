import "./valueControl.css";
import { InputNumber } from "antd";
import { useState } from "react";

export interface IValueProps {
    value?: number;
    onChange?: (val: number|null) => void;
    min?: number;
    max?: number;
}

export interface IValueControlProps extends IValueProps {

}

export function ValueControl (props: IValueControlProps) {
    const [value, setValue] = useState<number|null>(props.value ?? 0);
    const onValueChanged = function(val: number|null) {
        setValue(val);
        if(!!props.onChange) {
            props.onChange(val);
        }
    }
    return (<>
        <InputNumber value={value} 
            onChange={onValueChanged} 
            min={props.min} 
            max={props.max}>
        </InputNumber>
    </>);
}