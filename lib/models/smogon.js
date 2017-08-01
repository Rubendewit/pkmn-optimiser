import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { fetchAllPokemon } from './pokemon';
import { wrap } from '../helpers/util';
import { download, get, getUrl } from '../helpers/request';
import { normalizeMegaName, normalizeName } from '../normalizers/name';

const getSmogonImageUrl = name => `http://www.smogon.com/dex/media/sprites/xy/${name}.gif`;
const getStaticDataUrl = filename => path.join(__dirname, '..', 'static', 'data', filename);

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

    const files = _.map(keys, key => {
      fs.writeFile(getStaticDataUrl(`${key}.json`), JSON.stringify(data[key], null, 2), 'utf-8', error => {
        if(error) return error;
      });
    });

    console.log('>>', files);

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
        normalizedName,
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
