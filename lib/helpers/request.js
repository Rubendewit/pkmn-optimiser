/* eslint-disable no-console */
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import request from 'request';
import config from '../config';

const defaultOptions = {
  json: true,
  headers: {
    'Content-Type': 'application/json',
  }
};

export const get = requestOptions => new Promise((resolve, reject) => {

  const options = _.merge({}, defaultOptions, requestOptions);

  return request(options, (error, response, body) => {
    if(error) {
      return reject(error);
    }

    const { statusCode, statusMessage } = response;

    if(body && body.error) {
      return reject({
        code: statusCode,
        message: body.error.message || statusMessage,
        requestOptions: options,
        errorBody: body
      });
    }

    if(statusCode >= 400) {
      return reject({
        code: statusCode,
        message: statusMessage,
        requestOptions: options,
        errorBody: body
      });
    }

    return resolve(body);
  });
});

export const getUrl = (key, params) => {
  if(typeof config.endpoints[key] === 'function') {
    return config.endpoints[key](params);
  } else {
    throw new Error(key + params);
  }
};

export const download = (uri, filename, callback) => {
  request.head(uri, (err, res) => {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    const pathname = path.join(__dirname, '..', 'static', 'images', filename);
    request(uri).pipe(fs.createWriteStream(pathname)).on('close', callback);
  });
};
