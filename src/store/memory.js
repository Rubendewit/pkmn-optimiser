import Boom from 'boom';
import request from '../helpers/request';
import redisClient from './redis/extended-client';

const setOne = (id, data, type) => {
  redisClient.setItem({id, data, type});
};

const setMany = (data, type) => {
  data.forEach(item => setOne(item.id, item, type));
};

const requestOrThrow = (requestOptions, redisOptions) => {
  if(requestOptions) {
    return request(requestOptions, redisOptions);
  } else {
    throw Boom.notFound();
  }
};

const getOne = (requestOptions, redisOptions) => {
  const { type, id } = redisOptions;
  return redisClient.getItem(id, type).catch(() => requestOrThrow(requestOptions, redisOptions));
};

const getMany = (requestOptions, redisOptions) => {
  const { type, ids } = redisOptions;
  return redisClient.getItems(ids, type).then(redisItems => {
    const { results, notFound } = redisItems;
    if(notFound.length === 0) {
      return results;
    } else {
      requestOptions.qs.id = notFound;
      return request(requestOptions, redisOptions).then(response => ([...results, ...response]));
    }
  }).catch(() => requestOrThrow(requestOptions, redisOptions));
};

export const cache = (redisOptions = {}, body) => {
  const { type, id, ids } = redisOptions;
  if(type && body) {
    if(id) {
      setOne(id, body, type);
    } else if(ids) {
      setMany(body, type);
    }
  }
};

export const get = (requestOptions, redisOptions) => {
  if(redisOptions) {
    return redisOptions.ids ? getMany(requestOptions, redisOptions) : getOne(requestOptions, redisOptions);
  } else {
    return request(requestOptions);
  }
};
