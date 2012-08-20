# livecoding

**[livecoding](http://livecoding.io/)** is an interactive sketchpad. Code modifications are instantly displayed - no need to refresh your browser. Click a number, adjust its value via the popup slider, and watch your work change on the fly!

100% totally based on Bret Victor's [Inventing on Principle](https://vimeo.com/36579366) talk, which is one of the best I've ever seen. If you watch only one talk this year, make sure it's this one.

### Setup

#### Mac/Linux

    git clone https://github.com/gabrielflorit/livecoding.git
    cd livecoding
    virtualenv venv
    . venv/bin/activate
    venv/bin/pip install -r requirements.txt

#### Windows

    git clone https://github.com/gabrielflorit/livecoding.git
    cd livecoding
	virtualenv venv
	venv\scripts\activate
    pip install -r requirements.txt

### Run

    python runserver.py

Hit http://127.0.0.1:5000 and start coding!
