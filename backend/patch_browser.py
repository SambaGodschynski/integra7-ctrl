from flask import Blueprint
from flask import request, abort, jsonify
from data import read_patches
from mymidi.MidiOut import current_midiout

app = Blueprint('patch_browser', __name__, static_url_path='/', static_folder='../patch-browser-web/build', subdomain='pb')

patches:{} = None
print("reading patches")
patches = {x.id:x for x in read_patches()}
print(f"{len(patches)} found")


@app.route('/api/patches', methods = ['GET'])
def get_patches():
    result = list(patches.values())
    result.sort(key= lambda x : x.id)
    return jsonify([x.__dict__ for x in result])

@app.route('/api/patch', methods = ['POST'])
def post_patch():
    patch_id = request.json["id"]
    ch = request.json["channel"]
    patch = patches[patch_id]
    output = current_midiout()
    if output is None:
        return jsonify({"message": "No active midi out put found please visit main page fist."}), 500
    output.cc(ch, 0x0, patch.msb)
    output.cc(ch, 0x20, patch.lsb)
    output.pc(ch, patch.pc-1)
    return jsonify({"result": "OK"})