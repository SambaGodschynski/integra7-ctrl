#!/bin/env python3
import config
from data import read_patches
from flask import Flask,jsonify,request
from flask_cors import CORS

patches = {x.id:x for x in read_patches()}

app = Flask(__name__)
CORS(app)

@app.route('/api/patch', methods = ['POST'])
def post_patch():
    patch_id = request.json["id"]
    patch = patches[patch_id]
    print(str(patch))
    return jsonify({"result": "OK"})

@app.route('/api/patches', methods = ['GET'])
def get_patches():
    result = list(patches.values())
    result.sort(key= lambda x : x.id)
    return jsonify([x.__dict__ for x in result])

if __name__=='__main__':
    app.run(debug=True, port=config.port)
