import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export class HuggingFaceEmbedder {
  private apiKey: string;
  private model: string;


  constructor(apiKey: string,model = "deepseek-ai/DeepSeek-Prover-V2-671B") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async embed(texts: string[]) {
    const res = await fetch(`https://api-inference.huggingface.co/pipeline/feature-extraction/${this.model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: texts }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Erro na API da HuggingFace: ${res.status} - ${error}`);
    }

    return await res.json();
  }
}
