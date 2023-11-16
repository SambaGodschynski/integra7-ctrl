#!/bin/env python3
import config
import rtmidi
from data import read_patches
from flask import Flask,jsonify,request
from flask_cors import CORS
from time import sleep
from mymidi.MidiOut import MidiOut
patches:{} = None
output:MidiOut = None
app = Flask(__name__)
CORS(app)


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
    app.run(debug=True, port=config.PORT)
    print("shutting down")
    output.close()
