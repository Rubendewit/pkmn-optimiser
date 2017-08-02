import apicache from 'apicache';
import redis from 'redis';
import config from '../config';

let cache = apicache.options({
  redisClient: redis.createClient()
}).middleware;

const onlyStatus200 = (req, res) => config.api === 'production' && res.statusCode === 200;

export const cacheSuccesses = cache('1 month', onlyStatus200);
