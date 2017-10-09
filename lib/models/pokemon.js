import dex from 'oakdex-pokedex';
import { wrap } from '../helpers/util';
import * as smogon from '../../static/smogon';
import { getPokemonId } from '../helpers/pokemon';

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

    if(isNaN(parseInt(id))) {
      throw new Error('Invalid id');
    }

    return fetchPokemonById(id).then(pokemon => {

      if(!pokemon) {
        throw new Error('No Pokémon found');
      }

      res.locals.body = pokemon;
    });
  });
};

export const getAllPokemon = (req, res, next) => {
  return wrap(next, () => {
    return res.locals.body = smogon.pokemon;
  });
};
