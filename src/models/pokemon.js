import Boom from 'boom';
import { getIds, getSpeciesIds, getSpeciesName, getSpeciesTypes } from '../queries/species';

export const getAllPokemon = async () => {
  try {
    const ids = await getIds();
    return ids;
  } catch(err) {
    throw err;
  }
};

export const getPokemonDetail = () => {};

export const getPokemonIds = async () => {
  try {
    return await getSpeciesIds();
  } catch(err) {
    throw Boom.badImplementation(err);
  }
};

export const fetchPokemonOverviewData = async ({ id, languageId }) => {
  try {
    const name = await getSpeciesName({ id, languageId });
    const types = await getSpeciesTypes({ id });
    return { id, name, types };
  } catch(err) {
    throw Boom.badImplementation(err);
  }
};
