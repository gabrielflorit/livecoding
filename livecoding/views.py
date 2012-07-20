import os
import datetime
import requests
import requests_cache
import json
from livecoding import app
from flask import render_template, send_from_directory, redirect, session, request
from requests import post

requests_cache.configure('demo_cache')

@app.route('/save-anonymously', methods=['POST'])
def save_anonymously():

    gist = {
        'description': 'created by livecoding - http://livecoding.gabrielflor.it',
        'public': 'true',
        'files': {
            'water.js': {
                'content': request.form['js']
            },
            'water.css': {
                'content': request.form['css']
            }
        }
    }

    headers = {'content-type': 'application/json', 'accept': 'application/json'}
    r = requests.post('https://api.github.com/gists', data=json.dumps(gist), headers=headers)

    return json.loads(r.text)['html_url']




# @app.route('/github-login')
# def github_login():

#     # take user to github for authentication
#     return redirect('https://github.com/login/oauth/authorize?client_id=' + os.getenv('CLIENT_ID') + '&scope=gist')




# @app.route('/github-logged-in')
# def github_logged_in():

#     # get temporary code
#     tempcode = request.args.get('code', '')

#     # construct data and headers to send to github
#     data = {'client_id': os.getenv('CLIENT_ID'), 'client_secret': os.getenv('CLIENT_SECRET'), 'code': tempcode }
#     headers = {'content-type': 'application/json', 'accept': 'application/json'}

#     # request an access token
#     r = requests.post('https://github.com/login/oauth/access_token', data=json.dumps(data), headers=headers)

#     # grab access token
#     token = json.loads(r.text)['access_token']

#     return render_template('token.html', vars=dict(token = token))




@app.route('/loadremoteurl', methods=['POST'])
def loadremoteurl():

    r = requests.get(request.form['url'])

    return r.text




@app.route('/!')
def index_with_exclamation_point():

    return redirect('/')




@app.route('/', defaults={'gistId': None})
@app.route('/<int:gistId>')
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
