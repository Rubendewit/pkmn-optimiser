import dex from 'oakdex-pokedex';
import { wrap } from '../helpers/util';
import * as smogon from '../../static/smogon';
import { normalizeName } from '../normalizers/name';

// TODO: Find a permanent, elegant solution to request issues.
// Need to keep a map of normalized names + ID's, as some pokemon names will be transformed during a request.
// For example, Nidoran♂ will be transformed to NidoranB, thus needs to be fetched using its ID.
const idMap = {};

dex.allPokemon(p => {
  p.forEach(pokemon => {
    const { national_id, names } = pokemon;
    idMap[normalizeName(names.en)] = national_id;
  });
});

const getPokemonId = name => {
  return idMap[normalizeName(name)];
};

const fetchPokemonById = id => {
  return new Promise(resolve => {
    dex.findPokemon(id, pokemon => resolve(pokemon));
  });
};

export const augmentPokemon = async (req, res, next) => {
  return wrap(next, async () => {

    const list = [];

    for(let pokemon of res.locals.body) {
      const id = getPokemonId(pokemon.name);
      const augment = id ? await fetchPokemonById(id) : {};
      list.push({...pokemon, ...augment});
    }

    return res.locals.body = list;
  });
};

export const getPokemon = (req, res, next) => {
  return wrap(next, () => {

    const { id } = req.params;
    return fetchPokemonById(id).then(pokemon => {
      res.locals.body = pokemon;
    });
  });
};

export const getAllPokemon = (req, res, next) => {
  return wrap(next, () => {
    return res.locals.body = smogon.pokemon;
  });
};
