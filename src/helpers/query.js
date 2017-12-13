import { execute } from '../store/postgres';
import { getCache, setCache } from '../store/cache';

export const doQuery = async ({ query, redisOptions }) => {
  if(redisOptions) {
    const cached = await getCache(redisOptions);
    if(cached) return cached;
  }

  return await execute(query).then(data => {
    if(redisOptions) setCache({ ...redisOptions, data });
    return data;
  });
};
