import dex from 'oakdex-pokedex';
import { normalizeName } from '../normalizers/name';

// TODO: Find a permanent, elegant solution to request issues.
// Need to keep a map of normalized names + ID's, as some pokemon names will be transformed during a request.
// For example, Nidoran♂ will be transformed to NidoranB, thus needs to be fetched using its ID.
const idMap = {};

dex.allPokemon(p => {
  p.forEach(pokemon => {
    const { national_id, names } = pokemon;
    idMap[normalizeName(names.en)] = national_id;
  });
});

export const getPokemonId = name => {
  return idMap[normalizeName(name)];
};
