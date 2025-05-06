import { redis, redisVectorStore } from "./redis-store";

async function search() {
  await redis.connect()
  const response = await redisVectorStore.similaritySearchWithScore(
    'Por que todos que acreditam em Deus são considerados eleitos?',
    5
  )
  console.log(response)

  await redis.disconnect();
}

search();