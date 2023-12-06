"use strict"
// https://webmidijs.org/


function MyWebMidi() {
    this.allMidiInputs = [{% for input in midi_inputs %}"{{input}}",{% endfor %}];
    this.allMidiOutputs = [{% for output in midi_outputs %}"{{output}}",{% endfor %}];
    this.activeInputListeners = [];
    this.inPortDelegateFuncName = [];

    const getInputPorts = () => {
        const result = this.allMidiInputs
            .map(x => ({
                "MIDIEndpointUIDKey": x,
                "MIDIDeviceNameKey": x,
                type: 'input'
            }));
        return result;
    };
    const getOutputPorts = () => {
        const result = this.allMidiOutputs
            .map(x => ({
                "MIDIEndpointUIDKey": x,
                "MIDIDeviceNameKey": x,
                type: 'output'
            }));
        return result;
    };
    const onMidiMessageReceived = (index, msg) => {
        if (msg.rawData[0] !== 0xf0) {
            console.log(`unhandled message received ${msg.type}`)
            return;
        }
        const hexStr = bytestoHexStr(msg.rawData);
        console.log(`RECEIVED: ${hexStr}`);
        const fkey = this.inPortDelegateFuncName[index]; //  _rwc_0is$
        window[fkey]("midiInputMessage", hexStr);
    };
    const connectInput = async (index, inputObj) => {
        inputObj = JSON.parse(inputObj);
        const input = this.allMidiInputs
            .find(x => x === inputObj["MIDIEndpointUIDKey"]);
        MyBackend.connectInput(index, input);
        //const listener = input.addListener("midimessage", onMidiMessageReceived.bind(this, index));
        //this.activeInputListeners[index] = listener;
    };
    const connectOutput = async (index, outputObj) => {
        outputObj = JSON.parse(outputObj);
        const output = this.allMidiOutputs
            .find(x => x === outputObj["MIDIEndpointUIDKey"]);
        MyBackend.connectOutput(index, output);
    };
    const disconnectAllInputs = () => {
        this.activeInputs = [];
        for(let listener of this.activeInputListeners) {
            listener.remove();
        }
        this.activeInputListeners = [];
    };
    const disconnectAllOutputs = () => {
        this.activeOutputs = [];
    };
    const outputPortSend = async (index, hexStr) => {
        console.log(`SENDING: ${hexStr}`);
        MyBackend.sendMidi(index, hexStr);
    };

    const inputPortDelegate = (index, funcStr) => {
        this.inPortDelegateFuncName[index] = funcStr;
    }
    return {
        inputPort_endpoints: getInputPorts,
        outputPort_endpoints: getOutputPorts,
        inputPort_connectEndpoint: connectInput,
        outputPort_connectEndpoint: connectOutput,
        inputPort_disconnectAllEndpoints: disconnectAllInputs,
        outputPort_disconnectAllEndpoints: disconnectAllOutputs,
        outputPort_send: outputPortSend,
        inputPort_delegate: inputPortDelegate,
    };
}


(function(window) {
    window["_midi_"] = new MyWebMidi();
})(window)