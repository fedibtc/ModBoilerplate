import redis from "redis";

let client: redis.RedisClientType;

if (process.env.NODE_ENV === "production") {
  const { REDIS_URL } = process.env;

  if (!REDIS_URL) {
    throw new Error("Environment variable REDIS_URL required");
  }

  client = redis.createClient({
    url: REDIS_URL,
  });
} else {
  client = redis.createClient();
}

client.on("error", console.log).connect();

export default client;
