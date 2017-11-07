import Boom from 'boom';
import Debug from 'debug';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes';
import errorHandler from './helpers/errorHandler';
import logger from './helpers/logger';
import config from './config';

const debug = Debug('pkmn:server');

debug('Setting up Koa');
const app = new Koa();

debug('Setting up Bodyparser');
app.use(bodyParser());

debug('Setting up Errorhandler');
app.use(errorHandler());

debug('Setting up Logging');
app.use(logger());

debug('Setting up Routes');
app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(() => {
    throw Boom.notFound('Route not found');
  });

export const server = app.listen(config.port, () => debug(`Catching 'mons on Route ${config.port}`));
