import combineRouters from 'koa-combine-routers';
import routerCache from './cache';
import routerMeta from './meta';
import routerPokemon from './pokemon';

export default combineRouters(routerCache, routerMeta, routerPokemon);
