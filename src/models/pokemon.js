import { getIds } from '../helpers/query';

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
