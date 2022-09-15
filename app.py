from flask import Flask, request, jsonify, send_from_directory
from models.Books import Book
from utils import flatten

app = Flask(__name__,static_url_path='',static_folder='public')

@app.post('/api/recommend')
def recommend_route():
    temp = Book()

    params = request.json

    recommendations = []

    for bookname in params.get('books',[]):
        recommendations.append(temp.recommend(bookname))
    
    recommendations = flatten(recommendations)

    return jsonify({
        "recommendations": recommendations
    })

@app.post('/api/book/<id>')
def get_book_detail(id):
    book = Book()

    book = book.select(['*']).filter(f'ID = "{id}"').run()
    if book:
        return jsonify({
            "book": book.pop()
        })
    else:
        return jsonify({
            "book": None
        })

@app.post('/api/search')
def get_search_result():
    book = Book()

    params = request.json


    term = params.get('term','')
    last = params.get('last',0)

    results = book.select('*').filter(f'lower(Title) LIKE \'%{term.lower()}%\'').run()


    return jsonify({
        "results": results
    })


@app.post('/api/books')
def get_books():
    book = Book()

    params = request.json


    last = params.get('last',0)

    results = book.select_m_n(last,10)


    return jsonify({
        "results": results
    })

@app.route('/')
def main1():
    return send_from_directory('public', 'index.html')

@app.route('/recommend')
def main2():
    return send_from_directory('public', 'index.html')

def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,POST')
  return response

if __name__ == '__main__':
    app.run()