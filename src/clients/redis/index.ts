import Redis from "ioredis"

export const redisClient = new Redis(
    "rediss://default:AdOWAAIncDExOGYwYjU5MTA4ZjU0MDg2YjAxNGY4MWE3MTE4NTgxNnAxNTQxNjY@grand-tuna-54166.upstash.io:6379"
);

