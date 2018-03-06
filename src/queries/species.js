import { doQuery } from '../helpers/query';
import {
  normalizeSpeciesAbilities,
  normalizeSpeciesForms,
  normalizeSpeciesIds,
  normalizeSpeciesName,
  normalizeSpeciesStats
} from '../normalizers/species';
import { getAbilityName } from './abilities';
import { getTypeName } from './types';

const fetchSpeciesForms = async id => {
  const redisOptions = {
    type: 'species',
    id: 'forms'
  };

  const query = {
    command: `
      SELECT id, identifier, "order"
      FROM pokemon
      WHERE species_id = ${id}
      AND is_default = false
    `
  };

  return await doQuery({ query, redisOptions }).then(normalizeSpeciesForms);
};

export const getSpeciesAbilities = async ({ id }) => {
  const redisOptions = {
    type: 'species',
    id: 'abilities'
  };

  const query = {
    command: `
      SELECT ability_id, is_hidden, slot
      FROM pokemon_abilities
      WHERE pokemon_id = ${id}
    `
  };

  return await doQuery({ query, redisOptions })
    .then(
      async res =>
        await Promise.all(
          res.map(async item => {
            const abilityName = await getAbilityName({ id: item.ability_id });
            return { ...item, abilityName };
          })
        )
    )
    .then(normalizeSpeciesAbilities);
};

export const getSpeciesForms = async ({ id }) => {
  const forms = await fetchSpeciesForms(id);

  const augmentedForms = await Promise.all(
    forms.map(async form => {
      const { id: formId } = form;
      const stats = await getSpeciesStats({ id: formId });
      const types = await getSpeciesTypes({ id: formId });
      const abilities = await getSpeciesAbilities({ id: formId });
      return { ...form, types, stats, abilities };
    })
  );

  return augmentedForms;
};

export const getSpeciesIds = async () => {
  const redisOptions = {
    type: 'species',
    id: 'ids'
  };

  const query = {
    command: `
      SELECT DISTINCT species_id
      FROM pokemon
      WHERE is_default = true
      ORDER by species_id asc
      LIMIT 30
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
