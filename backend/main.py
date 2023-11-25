#!/bin/env python3
import config
import rtmidi
import os
from data import read_patches
from flask import Flask, jsonify,request, redirect
from flask_socketio import SocketIO # https://flask-socketio.readthedocs.io/en/latest/getting_started.html https://socket.io/docs/v4/client-initialization/
from flask_cors import CORS
from time import sleep
from mymidi.MidiOut import MidiOut
patches:{} = None
output:MidiOut = None
app = Flask(__name__, static_url_path='/', static_folder='../frontend/build/')
app.config['SECRET_KEY'] = config.APP_SECRET
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*') #, logger=True, engineio_logger=True)

@app.route('/')
def home():
    return redirect("/index.html", code=302)

@app.route('/api/patch', methods = ['POST'])
def post_patch():
    patch_id = request.json["id"]
    ch = request.json["channel"]
    patch = patches[patch_id]
    output.cc(ch, 0x0, patch.msb)
    output.cc(ch, 0x20, patch.lsb)
    output.pc(ch, patch.pc-1)
    return jsonify({"result": "OK"})

@app.route('/api/patches', methods = ['GET'])
def get_patches():
    result = list(patches.values())
    result.sort(key= lambda x : x.id)
    return jsonify([x.__dict__ for x in result])

def find_midi_port(name, midi_io) -> (int, str):
    ports = midi_io.get_ports()
    for idx, port in enumerate(ports):
        if str(port).find(name) >= 0:
            return (idx, port)
    return None

def get_in_and_out():
    indevice = None
    outdevice = None
    if config.INPUT_DEVICE is not None:
        indevice = find_midi_port(config.INPUT_DEVICE, rtmidi.MidiIn())
    if config.OUTPUT_DEVICE is not None:
        outdevice = find_midi_port(config.OUTPUT_DEVICE, rtmidi.MidiOut())
    return indevice, outdevice

def wait_for_devices():
    indevice = None
    outdevice = None
    while True:
        indevice, outdevice = get_in_and_out()
        incheck = config.INPUT_DEVICE is None or indevice is not None
        outcheck = config.OUTPUT_DEVICE is None or outdevice is not None
        if incheck and outcheck:
            break
        sleep(5)
    return indevice, outdevice

@socketio.on('setValue')
def set_value(message):
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
    print('received value: ' + str(message))

if __name__=='__main__':
    print("wait for devices")
    indevice, outdevice = wait_for_devices()
    print("devices found:")
    print("input:", indevice)
    print("output:", outdevice)
    output = MidiOut(outdevice)
    print("reading patches")
    patches = {x.id:x for x in read_patches()}
    print(f"{len(patches)} found")
    print ("starting server")
    socketio.run(app, host= config.HOST, debug=config.DEBUG, port=config.PORT)
    print("shutting down")
    output.close()
