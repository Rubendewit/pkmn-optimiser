import _ from 'lodash';
import fse from 'fs-extra';
import path from 'path';
import { fetchAllPokemon } from './pokemon';
import { wrap } from '../helpers/util';
import { download, get, getUrl } from '../helpers/request';
import { normalizeMegaName, normalizeName } from '../normalizers/name';

const getSmogonImageUrl = name => `http://www.smogon.com/dex/media/sprites/xy/${name}.gif`;
const getSmogonDataPath = filename => path.join(__dirname, '..', '..', 'static', 'smogon', filename);

const fetchSmogonData = (gen = 'sm') => get({
  url: getUrl('smogon_data'),
  method: 'POST',
  body: {
    gen
  }
});

export const storeSmogonData = (req, res, next) => {
  return wrap(next, () => {
    const data = res.locals.smogon;
    const keys = _.keys(data);

    _.forEach(keys, key => {
      fse.writeJson(getSmogonDataPath(`${key}.json`), data[key], {spaces: 2})
        .catch(err => {
          console.error('File creation failed: ', err.stack); // eslint-disable-line
        });
    });
  });
};

export const downloadSmogonImages = (req, res, next) => {
  return wrap(next, () => {
    const names = res.locals.body;

    return names.map(name => {
      download(getSmogonImageUrl(name), `${name}.gif`, () => {
        console.log(`Download of ${name} is done`); // eslint-disable-line
      });
    });
  });
};

export const fetchSmogonBuild = (name, gen = 'sm') => get({
  url: getUrl('smogon_build'),
  method: 'POST',
  body: {
    alias: name,
    gen
  }
});

export const getSmogonBuild = (req, res, next) => {
  return wrap(next, () => {
    const pokemon = res.locals.body;
    const normalizedName = normalizeName(pokemon.names.en);

    return fetchSmogonBuild(normalizedName).then(smogon => {
      res.locals.body = {
        ...res.locals.body,
        smogon
      };
    });
  });
};

export const getSmogonData = (req, res, next) => {
  return wrap(next, () => {
    return fetchSmogonData().then(data => {
      res.locals.smogon = data;
    });
  });
};

export const getSmogonImageNames = (req, res, next) => {
  return wrap(next, () => {
    return fetchAllPokemon().then(pokemon => {
      const names = _(pokemon).map(mon => {
        const name = normalizeName(mon.names.en);

        if(!_.isEmpty(mon.mega_evolutions)) {
          const megaNames = _.map(mon.mega_evolutions, mega => {
            return normalizeMegaName(name, mega.image_suffix);
          });

          return [name, ...megaNames];
        }

        return name;
      }).sortBy().flatten().value();

      res.locals.body = names;
    });
  });
};
