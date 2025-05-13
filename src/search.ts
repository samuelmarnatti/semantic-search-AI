import { redis, redisVectorStore } from "./redis-store";

async function search() {
  await redis.connect()
  const response = await redisVectorStore.similaritySearchWithScore(
    'Quantas paróquias tem a igreja episcopal carismática?',
    5
  )
  console.log(response)

  await redis.disconnect();
}

search();