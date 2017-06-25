import { send, wrap } from '../helpers/util';
import { getPokemon } from '../models/pokemon';

const fetchAllPokemon = (req, res, next) => {
  return wrap(next, () => {
    res.locals.body = [
      'Bulbasaur',
      'Ivysaur',
      'Venusaur',
      'Squirtle'
    ];
  });
};


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

  api.get('/api/pokemon', fetchAllPokemon, send);

  api.get('/api/pokemon/:name', getPokemon, fetchSmogon, send);

};
