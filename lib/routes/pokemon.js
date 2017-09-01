import { cacheSuccesses } from '../helpers/cache';
import { send } from '../helpers/util';
import { sanitizeAllPokemon, sanitizePokemon } from '../normalizers/pokemon';
import { getAllPokemon, getPokemon, augmentPokemon } from '../models/pokemon';
import { getSmogonBuild } from '../models/smogon';

export default api => {

  api.get('/api/pokemon/all', cacheSuccesses, getAllPokemon, augmentPokemon, sanitizeAllPokemon, send);

  api.get('/api/pokemon/:id', cacheSuccesses, getPokemon, getSmogonBuild, sanitizePokemon, send);

};
