import { cacheSuccesses } from '../helpers/cache';
import { send } from '../helpers/util';
import { sanitizePokemon } from '../normalizers/pokemon';
import {
  downloadImages,
  getAllPokemonImages,
  getAllPokemonNames,
  getSmogonBuild,
  getPokemon
} from '../models/pokemon';

export default api => {

  api.get('/api/download/pokemon', getAllPokemonImages, downloadImages, send);

  api.get('/api/pokemon', cacheSuccesses, getAllPokemonNames, send);

  api.get('/api/pokemon/:nameOrNumber', cacheSuccesses, getPokemon, getSmogonBuild, sanitizePokemon, send);

};
