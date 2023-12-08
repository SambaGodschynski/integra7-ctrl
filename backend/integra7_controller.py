import rtmidi
from flask_socketio import Namespace
from mymidi.MidiOut import MidiOut
from mymidi.MidiInput import MidiInput

active_outputs = {}
active_inputs = {}

def get_midi_outputs() -> []:
    # pylint: disable=E1101
    ports = rtmidi.MidiOut().get_ports()
    return ports

def get_midi_inputs() -> []:
    # pylint: disable=E1101
    ports = rtmidi.MidiIn().get_ports()
    return ports

def _message_received(socket, index, msg_bytes):
    hex_str = bytearray(msg_bytes).hex().upper()
    socket.emit("message_received", {
        "hexString": hex_str,
        "index": index
    })

class Integra7SocketNamespace(Namespace):
    def on_send_midi(self, message):
        index = message['index']
        hex_str = message['hexString']
        bytes_ = list(bytearray.fromhex(hex_str))
        active_outputs[index].sysex(bytes_)

    def on_connect_output(self, message):
        index = message['index']
        output = message['outputId']
        deviceid = [idx for idx, name in enumerate(get_midi_outputs()) if name == output][0]
        active_outputs[index] = MidiOut(deviceid)

    def on_connect_input(self, message):
        index = message['index']
        input_ = message['inputId']
        deviceid = [idx for idx, name in enumerate(get_midi_inputs()) if name == input_][0]
        active_inputs[index] = MidiInput(deviceid, lambda x: _message_received(self, index, x[0]))

def close():
    for output in active_outputs.values():
        output.close()

    for input_ in active_inputs.values():
        input_.close()
