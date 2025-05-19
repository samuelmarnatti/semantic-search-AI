import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { HuggingFaceEmbeddingsAdapter } from "./huggingFaceEmbeddingsAdapter";

export const qdrant = new QdrantClient({
  url: "http://127.0.0.1:6333",
});
const embeddings = new HuggingFaceEmbeddingsAdapter();

 
export const vectorStore = new QdrantVectorStore( embeddings, {
          client: qdrant,
          collectionName: "igreja_episcopal",
});

