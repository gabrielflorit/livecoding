import os
from flask import Flask

app = Flask(__name__)

from util.gzipmiddleware import GzipMiddleware
app.wsgi_app = GzipMiddleware(app.wsgi_app, compresslevel=5)

import aigua.views

os.environ['CLIENT_ID'] = '9d827b263687bb7ad08b'
os.environ['CLIENT_SECRET'] = '0f8854df5a14ff8c2a47ce13c0f0dfb02637d213'
os.environ['SECRET_KEY'] = "\x7f\xfa'\x06\x15\x04\x14\x8c\x07\xd2&\xf36\xa1^\x13\x1fq\xf3\x99\xbd\xa4\x87\xa8"
app.secret_key = os.getenv('SECRET_KEY')
