#!/bin/env python3
import config
from flask import Flask, redirect, render_template
# https://flask-socketio.readthedocs.io/en/latest/getting_started.html https://socket.io/docs/v4/client-initialization/
from flask_socketio import SocketIO
from flask_cors import CORS
from integra7_controller import get_midi_outputs, get_midi_inputs, Integra7SocketNamespace, close as close_integra7
import patch_browser

app = Flask(__name__, static_url_path='/', static_folder='../ext/integra7-editor-web')
app.config['SECRET_KEY'] = config.APP_SECRET
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*') #, logger=True, engineio_logger=True)
socketio.on_namespace(Integra7SocketNamespace('/integra7'))
app.register_blueprint(patch_browser.app)

@app.route('/')
def home():
    return redirect("/index.html", code=302)

@app.route('/index.html')
def index():
    return render_template("index.html")

@app.route('/myMidi.js')
def my_midijs():
    out_ports = get_midi_outputs()
    in_ports = get_midi_inputs()
    return render_template("myMidi.js", midi_inputs=in_ports, midi_outputs=out_ports )

@app.route('/backend.js')
def backendjs():
    return render_template("backend.js", base_url=f"//{config.HOST}:{config.PORT}")

if __name__=='__main__':
    print ("starting server")
    app.config['SERVER_NAME'] = f"{config.HOST}:{config.PORT}" # without subdomain will not work
    socketio.run(app, host= config.HOST, debug=config.DEBUG, port=config.PORT)
    print("shutting down")
    close_integra7()
