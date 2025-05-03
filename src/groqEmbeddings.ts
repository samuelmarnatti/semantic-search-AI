class GroqEmbeddings {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "text-embedding-3-small") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return await Promise.all(texts.map(text => this.embedQuery(text)));
  }

  async embedQuery(text: string): Promise<number[]> {
    const res = await fetch("https://api.groq.com/openai/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        input: text,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Erro na API da Groq: ${res.status} - ${error}`);
    }

    const data = await res.json();
    return data.data[0].embedding;
  }
}
export default GroqEmbeddings;