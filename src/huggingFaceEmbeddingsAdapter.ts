import { HuggingFaceEmbedder } from "./huggingFace";

export class HuggingFaceEmbeddingsAdapter {
  private embedder: HuggingFaceEmbedder;

  constructor(apiKey: string) {
    this.embedder = new HuggingFaceEmbedder(apiKey);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return await this.embedder.embed(texts);
  }

  async embedQuery(text: string): Promise<number[]> {
    const [embedding] = await this.embedder.embed([text]);
    return embedding;
  }
}
