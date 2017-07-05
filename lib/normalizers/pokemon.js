import _ from 'lodash';
import { normalizeMegaEvolutions } from './megas';
import { normalizeLearnset } from './moves';
import { wrap } from '../helpers/util';

const pokemonProps = [
  'name',
  'normalizedName',
  'id',
  'types',
  'image',
  'abilities',
  'base_stats',
  'learnset',
  'learnset + smogon learnset // by level up, tm, breed (+parents) or tutor',
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

export const sanitizePokemon = (req, res, next) => {
  return wrap(next, () => {
    res.locals.body = _sanitizePokemon(res.locals.body);
  });
};
