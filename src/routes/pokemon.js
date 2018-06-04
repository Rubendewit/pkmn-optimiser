import Router from 'koa-router';
import { getPokemonDetailHandler, getPokemonOverviewHandler } from '../handlers/pokemon';

const router = new Router({ prefix: '/api/pokemon' });

router.get('/overview', getPokemonOverviewHandler);
router.get('/:id', getPokemonDetailHandler);

export default router;
