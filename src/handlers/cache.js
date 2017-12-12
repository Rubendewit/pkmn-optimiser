import flushClient from '../store/redis/flush-client';

// export const clearAllCache = (req, res, next) => {
//   return wrap(next, () => {
//     const { period } = req.params;
//     return flushClient.flushAll(parseInt(period, 10)).then(response => {
//       res.locals.body = response;
//     });
//   });
// }

// export const clearCache = (req, res, next) => {
//     const { type, id } = req.params;
//     return flushClient.flush({ type, id }).then(response => {
//       res.locals.body = response;
//     });
// }

export const clearAllCache = async ctx => (ctx.body = await flushClient.flushAll());

export const clearCache = async ctx => {
  const { params: { id, type } } = ctx;
  const result = await flushClient.flush({ id, type });
  ctx.body = result;
};
