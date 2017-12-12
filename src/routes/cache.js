import Router from 'koa-router';
import { clearAllCache, clearCache } from '../handlers/cache';

const router = new Router({ prefix: '/api/cache' });

router.get('/clear', clearAllCache);
router.get('/:type/:id', clearCache);

export default router;
