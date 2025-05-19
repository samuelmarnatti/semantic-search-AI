import path from "node:path";
import { Qdrant } from 'qdrant';
import  { DirectoryLoader} from "langchain/document_loaders/fs/directory";
import  { JSONLoader} from "langchain/document_loaders/fs/json";
import { TokenTextSplitter } from "langchain/text_splitter";
import { QdrantVectorStore } from "@langchain/qdrant";
import { HuggingFaceEmbeddingsAdapter } from "./huggingFaceEmbeddingsAdapter";
import { QdrantClient } from "@qdrant/js-client-rest";

  const loader = new DirectoryLoader(
    path.resolve(__dirname, "../tmp"),
    {
      ".json": (path) => new JSONLoader(path, "/text"),
    }
  );

  const qdrant = new QdrantClient({
    url: "http://127.0.0.1:6333",
  });
  const embeddings = new HuggingFaceEmbeddingsAdapter();
  // const texts = [
  //   "LangChain facilita a construção de apps com IA.",
  //   "Qdrant é um banco de vetores para buscas semânticas.",
  // ];
  async function importar() {
    const docs = await loader.load();

    const splitter = new TokenTextSplitter({
      encodingName: "cl100k_base",
      chunkSize: 600,
      chunkOverlap: 0,
    });
    const splittedDocuments = await splitter.splitDocuments(docs);

    const vectorStore = await QdrantVectorStore.fromDocuments(splittedDocuments, embeddings, {
        client: qdrant,
        collectionName: "igreja_episcopal",
      });
    
    console.log("Importação concluída!");
  }
  importar().catch(console.error);


