import rtmidi

class MidiOut:
    output = None
    def __init__(self, device_index:int):
        # pylint: disable=E1101
        self.output = rtmidi.MidiOut()
        self.output.open_port(device_index)

    def close(self):
        self.panic()
        self.output.close_port()
        del self.output

    def panic(self) -> None:
        for ch in range(0, 15):
            self.cc(ch, 0x7b)

    def cc(self, ch:int, nr:int, value:int = 0) -> None:
        self.output.send_message([0xb << 4 | ch, nr, value])

    def pc(self, ch:int, value:int) -> None:
        self.output.send_message([0xc << 4 | ch, value])

    def sysex(self, msg:[]) -> None:
        self.output.send_message(msg)
