import _ from 'lodash';
import dex from 'oakdex-pokedex';
import { wrap } from '../helpers/util';
import * as smogon from '../../static/smogon';

const fetchPokemon = name => {
  return new Promise(resolve => {
    dex.findPokemon(name, pokemon => resolve(pokemon));
  });
};

export const augmentPokemon = async (req, res, next) => {
  return wrap(next, async () => {

    const list = [];

    for(let pokemon of res.locals.body) {
      const augment = await fetchPokemon(pokemon.name);
      list.push({...pokemon, ...augment});
    }

    return res.locals.body = list;
  });
};

export const getPokemon = (req, res, next) => {
  return wrap(next, () => {

    const { nameOrNumber } = req.params;

    if(!nameOrNumber) throw new Error('Missing name');

    return fetchPokemon(_.capitalize(nameOrNumber)).then(pokemon => {
      res.locals.body = pokemon;
    });
  });
};

export const getAllPokemon = (req, res, next) => {
  return wrap(next, () => {
    return res.locals.body = smogon.pokemon;
  });
};
