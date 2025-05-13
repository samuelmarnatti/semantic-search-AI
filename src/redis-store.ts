import { RedisVectorStore } from "@langchain/redis";
import { createClient } from 'redis';
import { HuggingFaceEmbeddingsAdapter } from "./huggingFaceEmbeddingsAdapter";
import dotenv from "dotenv";
dotenv.config();

  export const redis = createClient({
    url: "redis://127.0.0.1:6379",
  });

  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("A variável de ambiente HUGGINGFACE_API_KEY não está definida.");
  }

  const embeddings = new HuggingFaceEmbeddingsAdapter("scripts/embedding.py");

 export const redisVectorStore =  new RedisVectorStore(embeddings, {
    redisClient: redis,
    indexName: "textos-embeddings",
    keyPrefix: "texto:",
  });

