import path from "node:path";
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
  try {
    await redis.connect();
    console.log("✅ Conectado ao Redis com sucesso!");
  
    // Testa se consegue executar um comando simples
    await redis.set("teste_conexao", "ok");
    const valor = await redis.get("teste_conexao");
    console.log("🔍 Teste de conexão Redis:", valor); // deve exibir "ok"
  } catch (error) {
    console.error("❌ Erro ao conectar com o Redis:", error);
    process.exit(1); // encerra o script se falhar
  }
  try {
    const info = await redis.sendCommand(['FT.INFO', 'textos-embeddings']);
    console.log('FT.INFO manual:', info);
  } catch (err) {
    console.error('Erro ao testar FT.INFO manual:', err);
  }

  const embeddings = new HuggingFaceEmbeddingsAdapter();
  await RedisVectorStore.fromDocuments(splittedDocuments, embeddings, {
    redisClient: redis,
    indexName: "textos-embeddings",
    keyPrefix: "texto:",
  });

  await redis.disconnect();
}

load();