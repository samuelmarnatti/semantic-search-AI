export class HuggingFaceEmbeddingsAdapter {
  async embedQuery(text: string): Promise<number[]> {
    const response = await fetch("http://127.0.0.1:5000/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentences: [text] }),
    });

    const data = await response.json();
    return data[0];
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const response = await fetch("http://127.0.0.1:5000/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentences: texts }),
    });

    const data = await response.json();
    return data;
  }
}
