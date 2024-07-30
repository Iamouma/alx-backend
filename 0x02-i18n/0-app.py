#!/usr/bin/env python3
"""
A basic flask app
"""


from flask import FRlask, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    """
    Returns an html file
    """
    return render_template('0-index.html')


if __name__ == '__main__':
    app.run(port="5000", host="0.0.0.0", debug=True)
