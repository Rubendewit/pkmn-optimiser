import { send, wrap } from '../helpers/util';
import {
  downloadImages,
  getAllPokemonImages,
  getAllPokemonNames,
  getPokemon
} from '../models/pokemon';

const fetchSmogon = (req, res, next) => {
  return wrap(next, () => {
    res.locals.body = {
      ...res.locals.body,
      moveset: [
        'Synthesis',
        'Sludge Bomb',
        'Giga Drain',
        'Body Slam'
      ]
    };
  });
};

export default api => {

  api.get('/api/download', getAllPokemonImages, downloadImages, send);

  api.get('/api/pokemon', getAllPokemonNames, send);

  api.get('/api/pokemon/:nameOrNumber', getPokemon, fetchSmogon, send);

};
