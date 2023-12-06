import rtmidi

class MidiInput(object):
    def __init__(self, device_id: int) -> None:
        # pylint: disable=E1101
        self.midiin = rtmidi.MidiIn()
        self.midiin.open_port(device_id)
        self.midiin.set_callback(self)

    def __call__(self, event, data=None) -> None:
        print(event, data)

    def close(self):
        self.midiin.close_port()
        del self.midiin
