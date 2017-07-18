import apicache from 'apicache';
import redis from 'redis';

let cache = apicache.options({
  redisClient: redis.createClient()
}).middleware;

const onlyStatus200 = (req, res) => res.statusCode === 200;

export const cacheSuccesses = cache('1 month', onlyStatus200);
