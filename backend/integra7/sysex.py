# 41   ID number (Roland)
# 10   Device Id
# 00   Model ID #1
# 00   Model ID #2
# 64   Model ID #3
# 12   Command Id (DT1)
# 1A   upper byte of the starting address
# 02   upper middle byte of the starting address
# 00   lower middle byte of the starting address
# 26   lower byte of the starting address 
# 00   the actual data to be sent. Multiple bytes
# 3E   Checksum


ROLAND		= 0x41
DEV_ID      = 0x10
MODEL_ID    = [0x0, 0x0, 0x64]
RQ1         = 0x11
DT1          = 0x12
ROLAND_SYSEX = [0xf0, ROLAND, DEV_ID] + MODEL_ID
ROLAND_SYSEX_DT1 = ROLAND_SYSEX + [DT1]
ROLAND_SYSEX_RR1 = ROLAND_SYSEX + [RQ1]


def checksum(msg:[]) -> int:
    result = 0
    for value in msg:
        result = result + value
    return -result & 0x7F

def to_string(msg:[]):
    return " ".join([hex(x) for x in msg])

def create_msg(addr: int, value:int|str):
    '''
    	globals.communicator.dt1 = function(addr, v) {

		var dataS = toHexStr(addr, ADDR_SIZE);

		for (var i = 0, len = v.length; i < len; i++) {
			if (v[i] < 0x10)
				dataS += '0';
			dataS += v[i].toString(16);
		}

		var msg = ROLAND_DT1 + dataS; msg += (chksum(dataS) + 'F7');

		queue.push(msg);
	};

    '''
    addr_bytes = list(addr.to_bytes(4, byteorder='big', signed=False))
    msg = ROLAND_SYSEX_DT1 + addr_bytes + [value] + [checksum(addr_bytes + [value])] + [0xF7]
    return msg