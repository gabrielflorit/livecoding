import os
import datetime
import requests
import json
from livecoding import app
from flask import render_template, send_from_directory, redirect, session, request
from requests import post

@app.route('/save-anonymously', methods=['POST'])
def save_anonymously():

    gist = {
        'description': 'created by livecoding - http://livecoding.gabrielflor.it',
        'public': 'true',
        'files': {
            'water.html': {
                'content': request.form['html']
            },
            'water.js': {
                'content': request.form['javascript']
            },
            'water.css': {
                'content': request.form['css']
            },
            'water.json': {
                'content': request.form['json']
            }
        }
    }

    headers = {'content-type': 'application/json', 'accept': 'application/json'}
    r = requests.post('https://api.github.com/gists', data=json.dumps(gist), headers=headers)

    return json.loads(r.text)['id']




@app.route('/create-new', methods=['POST'])
def create_new():

    gist = {
        'description': 'created by livecoding - http://livecoding.gabrielflor.it',
        'public': 'true',
        'files': {
            'water.html': {
                'content': request.form['html']
            },
            'water.js': {
                'content': request.form['javascript']
            },
            'water.css': {
                'content': request.form['css']
            },
            'water.json': {
                'content': request.form['json']
            }
        }
    }

    token = request.form['token']

    headers = {'content-type': 'application/json', 'accept': 'application/json'}
    r = requests.post('https://api.github.com/gists?access_token=' + token, data=json.dumps(gist), headers=headers)

    return json.loads(r.text)['id']




@app.route('/fork', methods=['POST'])
def fork():

    gistId = request.form['id']
    token = request.form['token']

    headers = {'content-type': 'application/json', 'accept': 'application/json'}

    # fork
    r = requests.post('https://api.github.com/gists/' + gistId + '/fork?access_token=' + token, headers=headers)
    forkedGistId = json.loads(r.text)['id']

    # now save as user
    gist = {
        'description': 'created by livecoding - http://livecoding.gabrielflor.it/' + forkedGistId,
        'files': {
            'water.html': {
                'content': request.form['html']
            },
            'water.js': {
                'content': request.form['javascript']
            },
            'water.css': {
                'content': request.form['css']
            },
            'water.json': {
                'content': request.form['json']
            }
        }
    }

    r = requests.post('https://api.github.com/gists/' + forkedGistId + '?access_token=' + token, data=json.dumps(gist), headers=headers)

    return json.loads(r.text)['id']




@app.route('/save', methods=['POST'])
def save():

    gistId = request.form['id']
    token = request.form['token']

    headers = {'content-type': 'application/json', 'accept': 'application/json'}

    gist = {
        'description': 'created by livecoding - http://livecoding.gabrielflor.it/' + gistId,
        'files': {
            'water.html': {
                'content': request.form['html']
            },
            'water.js': {
                'content': request.form['javascript']
            },
            'water.css': {
                'content': request.form['css']
            },
            'water.json': {
                'content': request.form['json']
            }
        }
    }

    r = requests.post('https://api.github.com/gists/' + gistId + '?access_token=' + token, data=json.dumps(gist), headers=headers)

    return json.loads(r.text)['id']




@app.route('/github-login')
def github_login():

    # take user to github for authentication
    return redirect('https://github.com/login/oauth/authorize?client_id=' + os.getenv('CLIENT_ID') + '&scope=gist')




@app.route('/github-logged-in')
def github_logged_in():

    # get temporary code
    tempcode = request.args.get('code', '')

    # construct data and headers to send to github
    data = {'client_id': os.getenv('CLIENT_ID'), 'client_secret': os.getenv('CLIENT_SECRET'), 'code': tempcode }
    headers = {'content-type': 'application/json', 'accept': 'application/json'}

    # request an access token
    r = requests.post('https://github.com/login/oauth/access_token', data=json.dumps(data), headers=headers)

    # grab access token
    token = json.loads(r.text)['access_token']

    return render_template('token.html', vars=dict(token = token))




@app.route('/!')
def index_with_exclamation_point():

    return redirect('/')




@app.route('/iframe')
def iframe():

    return render_template('iframe.html')




@app.route('/', defaults={'gistId': None})
@app.route('/<gistId>')
def index(gistId):

    return render_template('index.html', vars=dict(
        version=versioning()
        ))




@app.route('/favicon.ico')
def favicon():

    return send_from_directory(os.path.join(app.root_path, 'static/img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')




def versioning():

    return datetime.date.today().strftime('%y%m%d')