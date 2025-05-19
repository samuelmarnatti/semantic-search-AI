from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed():
    # data = request.get_json()
    # sentences = data.get('sentences', [])
    # embeddings = model.encode(sentences)
    return jsonify('isso é um texto teste')

if __name__ == '__main__':
    app.run(port=5000)
