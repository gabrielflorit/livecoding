import os
import datetime
import requests
import json
import pymongo
from livecoding import app
from flask import render_template, send_from_directory, redirect, session, request
from requests import post
from pymongo import MongoClient
from bson import json_util




# TODO: create connection once, or per http request?
constr = os.getenv('MONGOHQ_URL')
db_name = constr.split('/')[-1]
connection = MongoClient(constr)
users = connection[db_name].users




@app.route('/gallery')
def gallery():
    return render_template('gallery.html', vars=dict(
        gaId=os.getenv('GOOGLE_ANALYTICS_ID')
    ))




@app.route('/user/<token>')
def user(token):
    r = requests.get('https://api.github.com/user?access_token=' + token + '&client_id=' + os.getenv('CLIENT_ID') + '&client_secret=' + os.getenv('CLIENT_SECRET'))
    return r.text




@app.route('/gists')
def gists():

    gists = users.find_one()['gists']
    # TODO: get 10 most recent gists

    return json.dumps(gists, default=json_util.default)




@app.route('/gists/<username>')
def gists_by_username(username):


    gists = users.find_one({'username': username})['gists']
    # TODO: get 10 most recent gists

    return json.dumps(gists, default=json_util.default)




@app.route('/save-anonymously', methods=['POST'])
def save_anonymously():

    gist = {
        'description': 'created by http://livecoding.io',
        'public': 'true',
        'files': {
            'options.json': {
                'content': request.form['options']
            }
        }
    }

    if len(request.form['html']) > 0:
        gist['files']['water.html'] = {
            'content': request.form['html']
        }

    if len(request.form['javascript']) > 0:
        gist['files']['water.js'] = {
            'content': request.form['javascript']
        }

    if len(request.form['css']) > 0:
        gist['files']['water.css'] = {
            'content': request.form['css']
        }

    if len(request.form['json']) > 0:
        gist['files']['water.json'] = {
            'content': request.form['json']
        }

    r = requests.post('https://api.github.com/gists', data=json.dumps(gist))
    jsonText = json.loads(r.text)
    gistId = jsonText['id']

    # add to mongo
    users.insert({
        "username": None,
        "gists": [
            {
                "_id": gistId,
                "modified": jsonText['updated_at']
            }
        ]
    })

    return gistId




@app.route('/create-new', methods=['POST'])
def create_new():

    isPublic = request.args.get('public', 'true')

    gist = {
        'description': 'created by http://livecoding.io',
        'public': isPublic,
        'files': {
            'options.json': {
                'content': request.form['options']
            }
        }
    }

    if len(request.form['html']) > 0:
        gist['files']['water.html'] = {
            'content': request.form['html']
        }

    if len(request.form['javascript']) > 0:
        gist['files']['water.js'] = {
            'content': request.form['javascript']
        }

    if len(request.form['css']) > 0:
        gist['files']['water.css'] = {
            'content': request.form['css']
        }

    if len(request.form['json']) > 0:
        gist['files']['water.json'] = {
            'content': request.form['json']
        }

    token = request.form['token']

    # create the gist
    r = requests.post('https://api.github.com/gists?access_token=' + token, data=json.dumps(gist))

    # get the newly created gist id
    jsonText = json.loads(r.text)
    gistId = jsonText['id']
    username = jsonText['user']['login']
    updated_at = jsonText['updated_at']

    # create the livecoding url
    livecodingUrl = 'http://livecoding.io/' + gistId

    gist['files']['README.md'] = {
        'content':  ('View this code at <a href="%s">%s</a>' % (livecodingUrl, livecodingUrl))
    }

    # save again, this time including the README.md
    r = requests.post('https://api.github.com/gists/' + gistId + '?access_token=' + token, data=json.dumps(gist))

    # add to mongodb
    if isPublic:
        document = users.find_one({'username': username})

        # is there an entry for this user?
        if document is not None:
            users.update({'username': username}, {'$push': {'gists': {'_id': gistId, 'modified': updated_at}}})
        else:
        # user isn't in mongo yet - add it
            users.insert({
                "username": username,
                "gists": [
                    {
                        "_id": gistId,
                        "modified": updated_at
                    }
                ]
            })

    return gistId




@app.route('/fork', methods=['POST'])
def fork():

    isPublic = request.args.get('public', 'true')

    if isPublic == 'false':
        return create_new()
    else:

        gistId = request.form['id']
        token = request.form['token']

        # fork
        r = requests.post('https://api.github.com/gists/' + gistId + '/fork?access_token=' + token)
        forkedGistId = json.loads(r.text)['id']

        # create the livecoding url
        livecodingUrl = 'http://livecoding.io/' + forkedGistId

        # now save as user
        gist = {
            'files': {
                'README.md': {
                    'content':  ('View this code at <a href="%s">%s</a>' % (livecodingUrl, livecodingUrl))
                },
                'options.json': {
                    'content': request.form['options']
                }
            }
        }

        if len(request.form['html']) > 0:
            gist['files']['water.html'] = {
                'content': request.form['html']
            }

        if len(request.form['javascript']) > 0:
            gist['files']['water.js'] = {
                'content': request.form['javascript']
            }

        if len(request.form['css']) > 0:
            gist['files']['water.css'] = {
                'content': request.form['css']
            }

        if len(request.form['json']) > 0:
            gist['files']['water.json'] = {
                'content': request.form['json']
            }

        r = requests.post('https://api.github.com/gists/' + forkedGistId + '?access_token=' + token, data=json.dumps(gist))

        return json.loads(r.text)['id']




@app.route('/save', methods=['POST'])
def save():

    gistId = request.form['id']
    token = request.form['token']

    # create the livecoding url
    livecodingUrl = 'http://livecoding.io/' + gistId

    gist = {
        'files': {
            'README.md': {
                'content':  ('View this code at <a href="%s">%s</a>' % (livecodingUrl, livecodingUrl))
            },
            'options.json': {
                'content': request.form['options']
            }
        }
    }

    if len(request.form['html']) > 0:
        gist['files']['water.html'] = {
            'content': request.form['html']
        }

    if len(request.form['javascript']) > 0:
        gist['files']['water.js'] = {
            'content': request.form['javascript']
        }

    if len(request.form['css']) > 0:
        gist['files']['water.css'] = {
            'content': request.form['css']
        }

    if len(request.form['json']) > 0:
        gist['files']['water.json'] = {
            'content': request.form['json']
        }

    r = requests.post('https://api.github.com/gists/' + gistId + '?access_token=' + token, data=json.dumps(gist))

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

    # request an access token
    r = requests.post('https://github.com/login/oauth/access_token', data=json.dumps(data))

    # grab access token
    token = json.loads(r.text)['access_token']

    return render_template('token.html', vars=dict(token = token))




@app.route('/!')
def index_with_exclamation_point():

    return redirect('/')




@app.route('/iframe')
def iframe():

    return render_template('iframe.html')




@app.route('/', defaults={'gistId': None, 'versionId': None})
@app.route('/<gistId>', defaults={'versionId': None})
@app.route('/<gistId>/<versionId>')
def index(gistId, versionId):

    return render_template('index.html', vars=dict(
        version=versioning(),
        gaId=os.getenv('GOOGLE_ANALYTICS_ID')
    ))




# @app.route('/gallery/<gistId>')
# def gallery(gistId):

#     return render_template('gallery.html', vars=dict(
#         gistId=gistId,
#         gaId=os.getenv('GOOGLE_ANALYTICS_ID')
#     ))




@app.route('/s/<gistId>', defaults={'versionId': None})
@app.route('/s/<gistId>/<versionId>')
def solo(gistId, versionId):

    if versionId is not None:
        versionId = '/' + versionId
    else:
        versionId = ''

    r = requests.get('https://api.github.com/gists/' + gistId + versionId + '?client_id=' + os.getenv('CLIENT_ID') + '&client_secret=' + os.getenv('CLIENT_SECRET'))

    theCss = json.loads(r.text)['files']['water.css']['content'] if ('water.css' in json.loads(r.text)['files']) else ''
    theJs = json.loads(r.text)['files']['water.js']['content'] if ('water.js' in json.loads(r.text)['files']) else ''
    theJson = json.loads(r.text)['files']['water.json']['content'] if ('water.json' in json.loads(r.text)['files']) else '""'
    theHtml = json.loads(r.text)['files']['water.html']['content'] if ('water.html' in json.loads(r.text)['files']) else ''
    theLibraries = json.loads(json.loads(r.text)['files']['options.json']['content'])['libraries'] if ('options.json' in json.loads(r.text)['files']) else []

    hideWatermark = request.args.get('hideWatermark', False)

    return render_template('solo.html', vars=dict(
        css=theCss,
        js=theJs,
        json=theJson,
        html=theHtml,
        libraries=theLibraries,
        gistAndVersionIds=(gistId + versionId),
        hideWatermark=hideWatermark
        ))




@app.route('/favicon.ico')
def favicon():

    return send_from_directory(os.path.join(app.root_path, 'static/img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')




def versioning():

    return datetime.date.today().strftime('%y%m%d')