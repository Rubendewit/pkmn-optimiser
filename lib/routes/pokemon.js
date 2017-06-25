import { wrap } from '../helpers/util';

const fetchPokemon = (req, res, next) => {
  return wrap(next, () => {
    res.locals.body = {
      name: 'Bulbasaur',
      id: '001'
    };
  });
}

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
}

const send = (req, res, next) => {
  const { body, error, status } = res.locals;

  if(error) {
    res.status(status || 500).send({})
  } else if (body) {
    res.status(status || 200).send(body)
  } else {
    res.status(status || 204).send()
  }

  next();
}

export default api => {
  api.get('/api/pokemon', fetchPokemon, fetchSmogon, send);
}
