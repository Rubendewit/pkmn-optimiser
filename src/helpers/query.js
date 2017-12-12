import { execute } from '../store/postgres';
import { getCache, setCache } from '../store/cache';

const limit = 2;
let offset = 0;

// const getIds = () => {
//   return query({
//     queryName: 'fetchIds',
//     redisOptions: {
//       type: 'overview',
//       id: 'all'
//     }
//   });
// };

export const getIds = async () => {
  const redisOptions = {
    type: 'overview',
    id: 'all'
  };

  const cached = await getCache(redisOptions);

  if(cached) return cached;

  return await execute({
    query: `
      SELECT id, identifier AS name, "order"
      FROM pokemon
      WHERE is_default = 'TRUE'
      LIMIT ${limit} OFFSET ${offset};
    `
  }).then(data => {
    setCache({ ...redisOptions, data });
    return data;
  });
};
