import { qdrant, vectorStore } from "./qdrant-store";

async function search() {

  const response = await vectorStore.similaritySearchWithScore(
    'Quantas paróquias tem a igreja episcopal carismática?',
    5
  )
  console.log(response)

}

search();