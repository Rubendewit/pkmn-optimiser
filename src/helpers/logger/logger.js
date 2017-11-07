import bunyan from 'bunyan';
import format from 'bunyan-format';

import serializers from './serializers';

export default config => {
  const logger = bunyan.createLogger({
    name: config.name,
    level: config.level,
    serializers,
    streams: []
  });

  if(config.file) {
    logger.addStream({
      type: 'rotating-file',
      path: config.file,
      period: '1h',
      count: 3
    });
  } else {
    logger.addStream({
      type: 'stream',
      stream: format({
        outputMode: 'short',
        color: true
      })
    });
  }

  return logger;
};
