import { cacheSuccesses } from '../helpers/cache';
import { send } from '../helpers/util';
import { sanitizePokemon } from '../normalizers/pokemon';
import { getAllPokemon, getPokemon } from '../models/pokemon';
import { getSmogonBuild } from '../models/smogon';

export default api => {

  api.get('/api/pokemon', cacheSuccesses, getAllPokemon, send);

  api.get('/api/pokemon/:nameOrNumber', cacheSuccesses, getPokemon, getSmogonBuild, sanitizePokemon, send);

};
