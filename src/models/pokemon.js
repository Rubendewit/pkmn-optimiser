// import { fetchIds } from '../helpers/query';
import { query } from '../store/memory';

const getIds = () => {
  return query({
    queryName: 'fetchIds',
    redisOptions: {
      type: 'overview',
      id: 'all'
    }
  });
};

export const getAllPokemon = async () => {
  try {
    const ids = await getIds();
    return ids;
    // return await normalizeData({ y });
  } catch(err) {
    throw err;
  }
};

export const getPokemonDetail = () => {};
