import Router from 'koa-router';
import { healthCheckHandler } from '../handlers/meta';

const router = new Router();

router.get('/healthcheck', healthCheckHandler);

export default router;
