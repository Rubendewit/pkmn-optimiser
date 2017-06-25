export const wrap = (next, fn) => new Promise(resolve => {
  resolve(fn());
}).then(() => next()).catch(err => {
  console.log({err});
  next(err);
});
