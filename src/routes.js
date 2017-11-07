import Router from 'koa-router';
import {
  getAllPokemonHandler,
  getPokemonDetailHandler,
  healthCheckHandler
} from './handlers';

const router = new Router();

router.get('/healthcheck', healthCheckHandler);

router.get('/api/pokemon/all', getAllPokemonHandler);
router.get('/api/pokemon/:id', getPokemonDetailHandler);

export default router;
