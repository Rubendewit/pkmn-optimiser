import _ from 'lodash';
import dex from 'oakdex-pokedex';
import { download } from '../download';
import { wrap } from '../helpers/util';
import { normalizeName } from '../normalizer/name';

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
      const names = _(pokemon).map(mon => normalizeName(mon.names.en)).sortBy().value();
      res.locals.body = names;
    });
  });
};

export const downloadImages = (req, res, next) => {
  return wrap(next, () => {
    const names = res.locals.body;
    const getUrl = (name) => `http://www.smogon.com/dex/media/sprites/xy/${name}.gif`;

    return names.map(name => {
      download(getUrl(name), `${name}.gif`, () => {
        console.log(`Download of ${name} is done`); // eslint-disable-line
      });
    });
  });
};
