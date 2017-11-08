import Boom from 'boom';
import request from '../helpers/request';
import queries from '../helpers/query';
import redisClient from './redis/extended-client';

const setOne = data => {
  redisClient.setItem(data);
};

const setMany = (data, type) => {
  data.forEach(item => setOne({id: item.id, data: item, type}));
};

const requestOrThrow = (requestOptions, redisOptions) => {
  if(requestOptions) {
    return request(requestOptions, redisOptions);
  } else {
    throw Boom.notFound();
  }
};

const getOne = (requestOptions, redisOptions) => {
  const { id, type } = redisOptions;
  return redisClient.getItem(id, type).catch(() => requestOrThrow(requestOptions, redisOptions));
};

const getMany = (requestOptions, redisOptions) => {
  const { ids, type } = redisOptions;
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
  const { id, ids, type } = redisOptions;
  if(type && body) {
    if(id) {
      setOne({id, data: body, type});
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

const getQuery = ({queryName, params, redisOptions}) => {
  const { id, type } = redisOptions;
  return redisClient.getItem(id, type).catch(() => doQuery({queryName, params, redisOptions}));
};

const doQuery = async ({queryName, params, redisOptions}) => {
  const result = await queries[queryName](params);

  if(redisOptions) {
    const { id, type } = redisOptions;
    setOne({id, data: result, type});
  }

  return result;
};

export const query = data => {
  if(data.redisOptions) {
    return getQuery(data);
  } else {
    return doQuery(data);
  }
};
