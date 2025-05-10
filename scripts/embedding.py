import sys
import json
from sentence_transformers import SentenceTransformer

def main():
    input_data = sys.stdin.read()
    sentences = json.loads(input_data)
    
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    embeddings = model.encode(sentences)

    # Convert numpy arrays to lists for JSON serialization
    embeddings_list = embeddings.tolist()
    print(json.dumps(embeddings_list))

if __name__ == "__main__":
    main()
