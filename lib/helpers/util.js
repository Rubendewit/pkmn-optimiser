/* eslint-disable no-console */
export const wrap = (next, fn) => new Promise(resolve => {
  resolve(fn());
}).then(() => next()).catch(err => {
  console.error(err);
  next(err);
});

export const send = (req, res) => {
  const { body, error, status } = res.locals;

  if(error) {
    res.status(status || 500).send({});
  } else if(body) {
    res.status(status || 200).send(body);
  } else {
    res.status(status || 204).send();
  }
};

export const arrayToObject = array => {
  return array.reduce((obj, item) => {
    obj[item] = item;
    return obj;
  }, {});
};
