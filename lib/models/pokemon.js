import _ from 'lodash';
import dex from 'oakdex-pokedex';
import { download, get, getUrl } from '../helpers/request';
import { wrap } from '../helpers/util';
import { normalizeName, normalizeMegaName } from '../normalizer/name';

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

const fetchSmogonBuild = (name, gen = 'sm') => get({
  url: getUrl('smogon'),
  method: 'POST',
  body: {
    alias: name,
    gen
  }
});

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

export const getPokemon = (req, res, next) => {
  return wrap(next, () => {

    const { nameOrNumber } = req.params;

    if(!nameOrNumber) throw new Error('Missing name');

    return fetchPokemon(_.capitalize(nameOrNumber)).then(pokemon => {
      res.locals.body = pokemon;
    });
  });
};

export const getAllPokemonNames = (req, res, next) => {
  return wrap(next, () => {
    return fetchAllPokemon().then(pokemon => {
      const names = _(pokemon).map(mon => mon.names.en).sortBy().value();
      res.locals.body = names;
    });
  });
};

export const getAllPokemonImages = (req, res, next) => {
  return wrap(next, () => {
    return fetchAllPokemon().then(pokemon => {
      const names = _(pokemon).map(mon => {
        const name = normalizeName(mon.names.en);

        if(!_.isEmpty(mon.mega_evolutions)) {
          const megaNames = _.map(mon.mega_evolutions, mega => {
            return mega.image_suffix ? normalizeMegaName(name, mega.image_suffix) : name + '-mega';
          });

          return [name, ...megaNames];
        }

        return name;
      }).sortBy().flatten().value();

      res.locals.body = names;
    });
  });
};

export const getSmogonBuild = (req, res, next) => {
  return wrap(next, () => {
    const pokemon = res.locals.body;
    const name = normalizeName(pokemon.names.en);

    return fetchSmogonBuild(name).then(smogon => {
      res.locals.body = {
        ...res.locals.body,
        smogon
      };
    });
  });
};
