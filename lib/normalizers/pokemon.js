import _ from 'lodash';
import { normalizeAbilities } from './abilities';
import { normalizeMegaEvolutions } from './megas';
import { normalizeLearnset } from './moves';
import { normalizeName } from './name';
import { normalizeStats } from './stats';
import { wrap } from '../helpers/util';

const pokemonProps = [
  'name',
  'normalized_name',
  'id',
  'types',
  'abilities',
  'stats',
  'tier',
  'megas',
  'image'
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
    const { alts: [ base, ...megas ], name, abilities } = pokemon;

    pokemon.id = pokemon.national_id;
    pokemon.normalized_name = normalizeName(name);
    pokemon.abilities = normalizeAbilities(base.abilities, abilities);
    pokemon.stats = normalizeStats(base);
    pokemon.tier = base.formats[0] || 'N/A';

    if(!_.isEmpty(megas)) {
      pokemon.megas = _.map(megas, mega => {
        const { suffix, types, abilities, formats } = mega;
        return {
          abilities: normalizeAbilities(abilities),
          stats: normalizeStats(mega),
          suffix,
          tier: formats[0],
          types
        };
      });
    }
    // const details = normalizeStats(alts);

    obj[pokemon.id] = _.pick(pokemon, pokemonProps);
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
