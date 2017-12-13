import { doQuery } from '../helpers/query';
import { normalizeSpeciesIds, normalizeSpeciesName, normalizeSpeciesStats } from '../normalizers/species';
import { getTypeName } from './types';

export const getSpeciesIds = async () => {
  const redisOptions = {
    type: 'species',
    id: 'ids'
  };

  const query = {
    command: `
      SELECT DISTINCT species_id
      FROM pokemon
    `
  };

  return await doQuery({ query, redisOptions }).then(normalizeSpeciesIds);
};

export const getSpeciesName = async ({ id, languageId }) => {
  const redisOptions = {
    type: 'species',
    id: 'names'
  };

  const query = {
    command: `
      SELECT name
      FROM pokemon_species_names
      WHERE pokemon_species_id = ${id}
      AND local_language_id = ${languageId}
    `
  };

  return await doQuery({ query, redisOptions }).then(normalizeSpeciesName);
};

export const getSpeciesStats = async ({ id }) => {
  const redisOptions = {
    type: 'species',
    id: 'stats'
  };

  const query = {
    command: `
      SELECT stat_id, base_stat
      FROM pokemon_stats
      WHERE pokemon_id = ${id}
    `,
    value: { id }
  };

  return await doQuery({ query, redisOptions }).then(normalizeSpeciesStats);
};

export const getSpeciesTypes = async ({ id }) => {
  const redisOptions = {
    type: 'species',
    id: 'types'
  };

  const query = {
    command: `
      SELECT type_id, slot
      FROM pokemon_types
      WHERE pokemon_id = ${id}
    `
  };

  return await doQuery({ query, redisOptions }).then(async res => {
    return await Promise.all(
      res.map(async item => {
        return await getTypeName({ id: item.type_id });
      })
    );
  });
};
