import { send } from '../helpers/util';
import {
  downloadImages,
  getAllPokemonImages,
  getAllPokemonNames,
  getSmogonBuild,
  getPokemon
} from '../models/pokemon';

export default api => {

  api.get('/api/download', getAllPokemonImages, downloadImages, send);

  api.get('/api/pokemon', getAllPokemonNames, send);

  api.get('/api/pokemon/:nameOrNumber', getPokemon, getSmogonBuild, send);

};
