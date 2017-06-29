import _ from 'lodash';
import dex from 'oakdex-pokedex';
import { wrap } from '../helpers/util';
import { download } from '../download';

const fetchAllPokemonNames = () => {
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

    const { name } = req.params;

    if(!name) throw new Error('Missing name');

    return fetchPokemon(_.capitalize(name)).then(pokemon => {
      res.locals.body = pokemon;
    });
  });
};

export const getAllPokemonNames = (req, res, next) => {
  return wrap(next, () => {
    return fetchAllPokemonNames().then(pokemon => {
      const names = _(pokemon).map(mon => mon.names.en).sortBy().value();
      res.locals.body = names;
    });
  });
};

export const downloadImages = (req, res, next) => {
  return wrap(next, () => {
    const names = res.locals.body;
    const getUrl = (name) => `http://www.smogon.com/dex/media/sprites/xy/${name.toLowerCase()}.gif`;

    return names.map(name => {
      download(getUrl(name), `${name}.gif`, () => {});
    });
  });
};
