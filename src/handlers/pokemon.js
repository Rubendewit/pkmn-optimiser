import { languageMap } from '../constants/languages';
import { getAllPokemon, fetchPokemonOverviewData, getPokemonIds } from '../models/pokemon';

export const getAllPokemonHandler = async ctx => {
  ctx.body = await getAllPokemon();
  // ctx.body = [{id: 1, name: 'Bulbasaur'}, {id: 4, name: 'Charmander'}, {id: 7, name: 'Squirtle'}];
};

export const getPokemonOverviewHandler = async ctx => {
  const { language = 'default' } = ctx.headers;
  const languageId = languageMap[language];

  const ids = await getPokemonIds();

  const list = await Promise.all(
    ids.map(async id => {
      return await fetchPokemonOverviewData({ id, languageId });
    })
  );

  ctx.body = list;
};

export const getPokemonDetailHandler = async ctx => {
  // const { params: { id } } = ctx;
  // ctx.body = await getPokemonDetail(id);
  ctx.body = { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], abilities: ['Overgrow', 'Chlorophyll'] };
};
