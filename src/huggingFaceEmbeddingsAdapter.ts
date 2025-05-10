import { spawn } from "child_process";

export class HuggingFaceEmbeddingsAdapter {
  private scriptPath: string;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
  }

  private runPythonScript(input: string[]): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      const py = spawn("python", [this.scriptPath]);

      let output = "";
      let error = "";

      py.stdout.on("data", (data) => {
        output += data.toString();
      });

      py.stderr.on("data", (data) => {
        error += data.toString();
      });

      py.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}:\n${error}`));
        } else {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            reject(new Error("Erro ao parsear a saída do Python: " + e));
          }
        }
      });

      // Envia os dados para o script via stdin
      py.stdin.write(JSON.stringify(input));
      py.stdin.end();
    });
  }

  // async embedDocuments(texts: string[]): Promise<number[][]> {
  //   console.log("Chamando Python com:", texts);
  //   return await this.runPythonScript(texts);
  // }
  async embedDocuments(texts: string[]): Promise<number[][]> {
    const BATCH_SIZE = 50;  // Ajuste conforme necessário
    const batches = [];
    
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE).map(text => 
        text.replace(/\n+/g, " ").trim()  // Remove quebras de linha e espaços extras
      );
      console.log("Chamando Pythons com:", texts);
      const embeddings = await this.runPythonScript(batch);
      batches.push(...embeddings);
    }
    return batches;
  }
  async embedQuery(text: string): Promise<number[]> {
    const [embedding] = await this.runPythonScript([text]);
    return embedding;
  }
}
