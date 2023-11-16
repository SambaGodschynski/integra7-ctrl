import rtmidi

class MidiOut:
    output = None
    def __init__(self, device_index:(int, str)):
        self.output = rtmidi.MidiOut()
        self.output.open_port(device_index[0])

    def close(self):
        self.panic()
        self.output.close_port()
        del self.output

    def panic(self):
        for ch in range(0, 15):
            self.cc(ch, 0x7b)

    def cc(self, ch, nr, value = 0):
        self.output.send_message([0xb << 4 | ch, nr, value])

    def pc(self, ch, value):
        self.output.send_message([0xc << 4 | ch, value])
