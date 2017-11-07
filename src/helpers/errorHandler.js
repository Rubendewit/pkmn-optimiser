import Boom from 'boom';
import Debug from 'debug';

const debug = Debug('pkmn:errorHandler');

export default () => async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    debug(err.toString());
    let boomError = err;

    if(!(err instanceof Error)) {
      boomError = Boom.badImplementation();
    } else if(!err.isBoom) {
      boomError = Boom.wrap(err, 500, err.message);
    }

    ctx.status = err.output.statusCode;
    ctx.body = {
      ...boomError.output.payload,
      ...(boomError.data = {})
    };
  }
};
