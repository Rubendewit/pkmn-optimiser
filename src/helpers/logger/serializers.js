import bunyan from 'bunyan';
import _ from 'lodash';

export default {
  err: err => {
    return bunyan.stdSerializers.err(err);
  },

  req: req => {
    if (!req) {
      return false;
    }

    return _.pick(req, ['httpVersion', 'method', 'url', 'headers']);
  },

  res: res => {
    if (!res) {
      return false;
    }

    const { statusCode, _headers: headers } = res;

    return {
      statusCode,
      headers
    };
  }
};
