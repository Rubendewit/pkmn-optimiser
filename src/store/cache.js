import redisClient from './redis/extended-client';

export const getCache = ({ id, type }) => redisClient.getItem(id, type).catch(() => null);

export const setCache = ({ id, type, data }) => redisClient.setItem({ id, type, data });
