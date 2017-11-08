import pg from 'pg-promise';
import Boom from 'boom';
import config from 'config';
import { postgresLogger as logger } from '../helpers/logger';

const pgp = pg({
  error: (err, e) => {
    const error = {};

    if(e.cn) {
      error.message = 'Connection error to Postgres database.';
      error.connection = e.cn;
    }

    if(e.query) {
      error.message = 'Error executing query';
      error.query = e.query;
      if(e.params) {
        error.parameters = e.params;
      }
    }

    if(e.ctx) {
      error.message = 'Error executing task or transaction';
      error.context = e.ctx;
    }

    logger.error(error);
  },
  disconnect: (client, dc) => {
    logger.fatal({
      message: 'Client pool has disconnected from database',
      context: dc
    });
  }
});

const connectionString = {
  ...config.get('postgres'),
  poolSize: 20,
  idleTimeoutMillis: 10000
};

export const db = pgp(connectionString);
export const execute = ({query, value}) => db.query(query, value).catch(e => {
  console.log(e);
  throw Boom.badImplementation('We\'re experiencing some technical difficulties.');
});
