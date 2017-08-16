import _ from 'lodash';
import { normalizeAbilities } from './abilities';
import { normalizeMegaEvolutions } from './megas';
import { normalizeLearnset } from './moves';
import { normalizeName } from './name';
import { wrap } from '../helpers/util';

const pokemonProps = [
  'name',
  'normalized_name',
  'id',
  'types',
  'image',
  'abilities',
  'base_stats',
  'learnset',
  'mega_evolutions',
  'strategies',
];

const _sanitizePokemon = pokemon => {
  pokemon.name = pokemon.names.en;
  pokemon.id = pokemon.national_id,
  pokemon.strategies = pokemon.smogon.strategies;
  pokemon.learnset = normalizeLearnset(pokemon.learnset, pokemon.smogon.learnset);
  pokemon.mega_evolutions = normalizeMegaEvolutions(pokemon.mega_evolutions);

  return _.pick(pokemon, pokemonProps);
};

const _sanitizeAllPokemon = list => {
  const obj = {};

  _.forEach(list, pokemon => {
    const { alts, name, abilities } = pokemon;

    pokemon.normalized_name = normalizeName(name);
    pokemon.abilities = normalizeAbilities(abilities, alts[0].abilities);
    // const details = normalizeStats(alts);

    obj[name] = pokemon;
  });

  return obj;
};

export const sanitizePokemon = (req, res, next) => {
  return wrap(next, () => {
    res.locals.body = _sanitizePokemon(res.locals.body);
  });
};

export const sanitizeAllPokemon = (req, res, next) => {
  return wrap(next, () => {
    res.locals.body = _sanitizeAllPokemon(res.locals.body);
  });
};
