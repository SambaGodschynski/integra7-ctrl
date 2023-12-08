import rtmidi


class MidiInput(object):
    def __init__(self, device_id: int, callback) -> None:
        # pylint: disable=E1101
        self.midiin = rtmidi.MidiIn()
        self.midiin.ignore_types(sysex=False)
        self.midiin.open_port(device_id)
        self.midiin.set_callback(self)
        self.callback = callback

    def __call__(self, event, data=None) -> None:
        self.callback(event)

    def close(self):
        self.midiin.close_port()
        del self.midiin
