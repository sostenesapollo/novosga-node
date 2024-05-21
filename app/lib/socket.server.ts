import Redis from "ioredis";

class RedisComponent {
	redisClient = new Redis(process.env.REDIS_URL, { family: 6 });

	constructor() {
		console.log("Init Redis Client", process.env.REDIS_URL);
	}
}

const redis = new RedisComponent().redisClient;

export { redis };
