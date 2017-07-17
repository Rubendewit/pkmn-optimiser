import apicache from 'apicache';

let cache = apicache.middleware;

const onlyStatus200 = (req, res) => res.statusCode === 200;

export const cacheSuccesses = cache('1 month', onlyStatus200);
