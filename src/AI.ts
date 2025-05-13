import { ChatGroq } from "@langchain/groq";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { redis, redisVectorStore } from './redis-store';
import * as dotenv from 'dotenv';

dotenv.config();

const chatModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // modelo suportado pela Groq
  temperature: 0.7,
});

const prompt = new PromptTemplate({
  template: `
Você responde perguntas sobre a Igreja Episcopal Carismática do Brasil. O usuário está assistindo o livro de apresentação da igreja.
Use o conteúdo das transcrições abaixo para responder à pergunta do usuário.
Se a resposta não for encontrada nas transcrições, diga que não sabe. Não tente inventar uma resposta.

Transcrições:
{context}

Pergunta:
{question}
  `.trim(),
  inputVariables: ['context', 'question'],
});

const chain = RetrievalQAChain.fromLLM(
  chatModel,
  redisVectorStore.asRetriever(),
  {
    prompt,
    returnSourceDocuments: true,
    verbose: true,
  }
);

async function main() {
  await redis.connect();

  const response = await chain.call({
    query: 'Quantas paróquias tem a igreja episcopal carismática?'
  });

  console.log(response);

  await redis.disconnect();
}

main();
