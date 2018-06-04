import { languageMap, defaultLanguage } from '../constants/languages';
import { getPokemonOverviewData, getPokemon } from '../models/pokemon';

export const getPokemonOverviewHandler = async ctx => {
  const { language = defaultLanguage } = ctx.headers;
  const languageId = languageMap[language];

  const pokemon = await getPokemon();

  const list = await Promise.all(
    pokemon.map(({ id, name }) => getPokemonOverviewData({ id, name, languageId }))
  );

  ctx.body = list;
};

export const getPokemonDetailHandler = async ctx => {
  // const { params: { id } } = ctx;
  // ctx.body = await getPokemonDetail(id);
  ctx.body = { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], abilities: ['Overgrow', 'Chlorophyll'] };
};
