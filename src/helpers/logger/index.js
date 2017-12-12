import config from 'config';
import uuid from 'uuid';
import Logger from './logger';

const logger = Logger({
  name: config.get('app.name'),
  level: 'info',
  file: false,
  ...config.get('log')
});

const createChildLogger = ({ context, level = 'fatal' }) => logger.child({ context, level });

export const postgresLogger = createChildLogger(config.get('log.children.postgresLogger'));
export const redisLogger = createChildLogger(config.get('log.children.redisLogger'));

export default () => (ctx, next) => {
  const { req, res } = ctx;
  const startTime = process.hrtime();

  // Generate and append request id
  if(!ctx.id) {
    ctx.id = uuid.v4();
  }

  // Generate log instance for this request
  const log = logger.child({
    id: ctx.id
  });

  // Log the request
  log.info(
    {
      id: ctx.id,
      req,
      body: ctx.request.body
    },
    'Start of the request'
  );

  // Log the response
  res.on('finish', () => {
    const endTime = process.hrtime(startTime);

    log.info(
      {
        id: ctx.id,
        res,
        body: ctx.body,
        duration: endTime[0] * 1e3 + endTime[1] * 1e-6 + 'ms'
      },
      'End of the response'
    );
  });

  // Log errors
  return next().catch(err => {
    if(err instanceof Error) {
      log.error({ err: err.stack });
    } else {
      log.error({ err });
    }
    throw err;
  });
};
