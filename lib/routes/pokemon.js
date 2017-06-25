import { send, wrap } from '../helpers/util';

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

const fetchPokemon = (req, res, next) => {
  return wrap(next, () => {
    res.locals.body = {
      name: 'Bulbasaur',
      id: '001'
    };
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

  api.get('/api/pokemon/:pokemonName', fetchPokemon, fetchSmogon, send);

};
