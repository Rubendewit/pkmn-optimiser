import _ from 'lodash';
import dex from 'oakdex-pokedex';
import { wrap } from '../helpers/util';

const fetchPokemon = name => {
  return new Promise((resolve, reject) => {
    dex.findPokemon(name, pokemon => resolve(pokemon));
  });
};

export const getPokemon = (req, res, next) => {
  return wrap(next, () => {

    const { name } = req.params;

    if(!name) throw new Error('Missing name');

    return fetchPokemon(_.capitalize(name)).then(pokemon => {
      res.locals.body = pokemon;
    });
  });
};
