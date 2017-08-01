import _ from 'lodash';
import dex from 'oakdex-pokedex';
import { wrap } from '../helpers/util';

const fetchAllPokemon = () => {
  return new Promise(resolve => {
    dex.allPokemon(pokemon => resolve(pokemon));
  });
};

const fetchPokemon = name => {
  return new Promise(resolve => {
    dex.findPokemon(name, pokemon => resolve(pokemon));
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
    return fetchAllPokemon().then(pokemon => {
      const names = _(pokemon).map(mon => mon.names.en).sortBy().value();
      res.locals.body = names;
    });
  });
};
