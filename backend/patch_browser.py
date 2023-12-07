from flask import Blueprint
from flask import request, send_from_directory


app = Blueprint('patch_browser', __name__, static_url_path='/', static_folder='../patch-browser-web/build', subdomain='pb')

