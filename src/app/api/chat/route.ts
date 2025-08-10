import { ChatGroq } from "@langchain/groq";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { qdrant, vectorStore } from "./qdrant-store";
import { nanoid } from 'nanoid'


const chatModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // modelo suportado pela Groq
  temperature: 0.7,
});

const prompt = new PromptTemplate({
  template: `
Você responde perguntas sobre a Igreja Episcopal Carismática do Brasil. O usuário está lendo os documentos da igreja.
Use o conteúdo nos documentos abaixo para responder à pergunta do usuário.
Se a resposta não for encontrada nas documentos, diga que não sabe. Responda de forma natural como se tu tivesse essas informações sem citar que 
ela está vindo de documentos. Não tente inventar uma resposta.

Documentos:
{context}

Pergunta:
{question}
  `.trim(),
  inputVariables: ['context', 'question'],
});
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = [...messages].reverse().find(m => m.role === 'user');
  const chain = RetrievalQAChain.fromLLM(
    chatModel,
    vectorStore.asRetriever(),
    {
      prompt,
      returnSourceDocuments: true,
      verbose: false,
    }
  );

  const query = {"query":lastMessage.content};
  const result = await chain.call({ query });


  const response = result.text.trim().replace(/\\n/g, " ").replace(/\n/g, " ");
  return new Response(
    JSON.stringify(response),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}