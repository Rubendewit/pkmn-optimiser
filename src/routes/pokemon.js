import Router from 'koa-router';
import { getAllPokemonHandler, getPokemonDetailHandler } from '../handlers/pokemon';

const router = new Router({ prefix: '/api/pokemon' });

router.get('/all', getAllPokemonHandler);
router.get('/:id', getPokemonDetailHandler);

export default router;
