import { ChatOpenAI } from "@langchain/openai";
import {RetrievalQAChain} from 'langchain/chains';
import { PromptTemplate } from "@langchain/core/prompts";
import { redis, redisVectorStore } from './redis-store';

 if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("A variável de ambiente OPENROUTER_API_KEY não está definida.");
  }

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  modelName: "meta-llama/llama-3-70b-instruct", // ou "deepseek-coder"
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost", 
      "X-Title": "Igreja Episcopal Carasmática",
    },
  },
  temperature: 0.7,
});
const prompt = new PromptTemplate({
  template: `
  Quantas paróquias tem a igreja episcopal carismática?

  Trancrições:
{context}

Pergunta:
{question}
  `.trim(),
  inputVariables: ['context', 'question'],
})

// Large Language Model
const chain = RetrievalQAChain.fromLLM(chatModel, redisVectorStore.asRetriever(),{
    prompt,
    returnSourceDocuments: true, // retorna em qual textos ele encontra o conteúdo pra tirar a dúvida.
    verbose: true // retorna log de tudo o que ele está fazendo no processo

})
async function main() {
  await redis.connect()

  const response = await chain.call({
    query: 'Me explique o conceito de eleição.'
  })
  console.log(response)

  await redis.disconnect()
}

main();