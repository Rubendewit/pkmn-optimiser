import { getAllPokemon, getPokemonDetail } from './models/pokemon';

export const getAllPokemonHandler = async ctx => {
  // ctx.body = await getAllPokemon();
  ctx.body = [{id: 1, name: 'Bulbasaur'}, {id: 4, name: 'Charmander'}, {id: 7, name: 'Squirtle'}];
};

let id = 5;

export const getPokemonDetailHandler = async ctx => {
  // const { params: { id } } = ctx;
  // ctx.body = await getPokemonDetail(id);
  ctx.body = {id, name: 'Bulbasaur', types: ['Grass', 'Poison'], abilities: ['Overgrow', 'Chlorophyll']};
  id++;
};

export const healthCheckHandler = async ctx => {
  ctx.body = {
    version: 0,
    buildNumber: process.env.BUILD_NUMBER || 0
  };
};
