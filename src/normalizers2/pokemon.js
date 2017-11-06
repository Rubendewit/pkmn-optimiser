import _ from 'lodash';
import { normalizeAbilities } from './abilities';
import { normalizeMegaEvolutions } from './megas';
import { normalizeLearnset } from './moves';
import { normalizeName } from './name';
import { normalizeStats } from './stats';
import { isDefined, wrap } from '../helpers/util';
import { getPokemonId } from '../helpers/pokemon';

const pokemonProps = [
  'name',
  'normalized_name',
  'id',
  'types',
  'abilities',
  'stats',
  'tier',
  'forms',
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
  const all = {};

  _.forEach(list, pokemon => {
    const { alts: [ base, ...megas ], names, national_id, abilities } = pokemon;

    // If the pokemon has no national ID, it's a variant supplied by the smogon data, and should be added to the forms property.
    // This is a nasty workaround, as Smogon treats variants as standalone pokemon, and Oakdex has no knowledge of Alolan variants.
    if(!national_id) {
      if(pokemon.name.indexOf('Alola') !== -1) {
        const { types, abilities, formats } = base;
        const name = normalizeName(pokemon.name.replace('-Alola', ''));
        const id = getPokemonId(name);

        return all[id].forms.push({
          abilities: normalizeAbilities(abilities),
          stats: normalizeStats(base),
          form: 'alola',
          tier: formats[0] || 'N/A',
          types
        });
      }

      return;
    }

    pokemon.name = names.en;
    pokemon.id = national_id;
    pokemon.normalized_name = normalizeName(names.en);
    pokemon.abilities = normalizeAbilities(base.abilities, abilities);
    pokemon.stats = normalizeStats(base);
    pokemon.tier = base.formats[0] || 'N/A';
    pokemon.forms = [];

    if(!_.isEmpty(megas)) {
      const megaData = _.map(megas, mega => {
        const { suffix, types, abilities, formats } = mega;
        return {
          abilities: normalizeAbilities(abilities),
          stats: normalizeStats(mega),
          form: suffix.toLowerCase(),
          tier: formats[0] || 'N/A',
          types
        };
      });
      pokemon.forms.push(...megaData);
    }

    return all[pokemon.id] = _.pick(pokemon, pokemonProps);
  });

  return all;
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
