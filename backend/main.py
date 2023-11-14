#!/bin/env python3
import config
from data import read_patches
from flask import Flask,jsonify
from flask_cors import CORS

patches = read_patches()

app = Flask(__name__)
CORS(app)

@app.route('/api/patches', methods = ['GET'])
def get_patches():
    return jsonify([x.__dict__ for x in patches])

if __name__=='__main__':
    app.run(debug=True, port=config.port)
