import _ from 'lodash';
import { wrap } from '../helpers/util';
import { download } from '../helpers/request';
import { normalizeMegaName, normalizeName } from '../normalizers/name';
import { fetchAllPokemon } from './pokemon';

const getSmogonImageUrl = (name) => `http://www.smogon.com/dex/media/sprites/xy/${name}.gif`;

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

export const getSmogonData = (req, res, next) => {
  return wrap(next, () => {
    // return fetchSmogonData().then(data => {
    //   res.locals.body = data;
    // })
  });
};
