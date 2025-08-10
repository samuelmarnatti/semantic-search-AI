readme_content = """# semantic-search-AI

**semantic-search-AI** é um projeto que permite treinar modelos de IA para busca semântica de forma totalmente gratuita.  
Enquanto a maioria dos modelos para *embedding* (como os da OpenAI) são pagos, este projeto possibilita realizar o treinamento localmente usando textos em formato JSON, além de incluir um **widget de chat** para testes.

## 🚀 Tecnologias utilizadas
- React
- Node.js
- Python
- LangChain
- Docker
- Hugging Face
- Qdrant

## 📦 Instalação

1. **Instalar Docker**
   - [Download do Docker](https://www.docker.com/get-started)

2. **Criar contas e gerar chaves**
   - [Hugging Face](https://huggingface.co/) → gere uma chave de API
   - [Groq](https://groq.com/) → gere uma chave de API

3. **Configurar variáveis de ambiente**
   - Crie o arquivo `.env.local` na raiz do projeto
   - Adicione:
     ```env
     GROQ_API_KEY="sua_chave_aqui"
     HUGGINGFACE_API_KEY="sua_chave_aqui"
     ```

4. **Instalar dependências**
   ```bash
   npm install
   npm install langchain @qdrant/js-client-rest @langchain/qdrant

    Rodar o Qdrant no Docker

Sempre exibir os detalhes

docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

Rodar a API Python

Sempre exibir os detalhes

python scripts/api.py

Rodar o projeto React

Sempre exibir os detalhes

    npm run dev

        Acesse: http://localhost:3000

📚 Treinamento de IA

    Prepare seus dados em formato JSON especial para treinamento (veja exemplos na pasta /tmp).

    Sugestão: utilize Manus ou ChatGPT para converter conteúdo para JSON.

    Coloque os arquivos no diretório /tmp.

    Execute o comando para criar os embeddings:

Sempre exibir os detalhes

pnpm tsx src/loader.ts

Teste no navegador através do widget de chat.
Exemplo de pergunta:

Sempre exibir os detalhes

    Quantas paróquias a igreja episcopal possui?

🔑 Requisitos de API

    GROQ_API_KEY

    HUGGINGFACE_API_KEY

f.write(readme_content)

readme_path
