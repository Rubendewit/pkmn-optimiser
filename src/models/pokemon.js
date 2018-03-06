import Boom from 'boom';
import {
  getIds,
  getSpeciesAbilities,
  getSpeciesForms,
  getSpeciesIds,
  getSpeciesName,
  getSpeciesStats,
  getSpeciesTypes
} from '../queries/species';

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
    const stats = await getSpeciesStats({ id });
    const abilities = await getSpeciesAbilities({ id });
    const forms = await getSpeciesForms({ id });
    return { id, name, types, stats, abilities, forms };
  } catch(err) {
    throw Boom.badImplementation(err);
  }
};
