import path from "node:path";
import dotenv from "dotenv";
dotenv.config();
import  { DirectoryLoader} from "langchain/document_loaders/fs/directory";
import  { JSONLoader} from "langchain/document_loaders/fs/json";
import { TokenTextSplitter } from "langchain/text_splitter";
import { RedisVectorStore } from "@langchain/redis";
import { createClient } from 'redis';
import { HuggingFaceEmbeddingsAdapter } from "./huggingFaceEmbeddingsAdapter";

const loader = new DirectoryLoader(
  path.resolve(__dirname, "../tmp"),
  {
    ".json": (path) => new JSONLoader(path, "/text"),
  }
);

async function load() {
  const docs = await loader.load();
  const splitter = new TokenTextSplitter({
    encodingName: "cl100k_base",
    chunkSize: 600,
    chunkOverlap: 0,
  });
  const splittedDocuments = await splitter.splitDocuments(docs);

  const redis = createClient({
    url: "redis://127.0.0.1:6379",
  });
  await redis.connect();

  const embeddings = new HuggingFaceEmbeddingsAdapter("scripts/embedding.py");

  await RedisVectorStore.fromDocuments(splittedDocuments, embeddings, {
    redisClient: redis,
    indexName: "textos-embeddings",
    keyPrefix: "texto:",
  });

  await redis.disconnect();
}

load();