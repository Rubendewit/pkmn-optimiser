import 'babel-polyfill';
import Boom from 'boom';
import Debug from 'debug';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes';
import errorHandler from './helpers/errorHandler';
import logger from './helpers/logger';

const debug = Debug('rights:server');

debug('Setting up Rights Service');
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

export const server = app.listen(port, () => debug(`Rights service listening on port ${port}`));
